"use server";

const BRIGHTDATA_API_URL = "https://api.brightdata.com/request";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

// ============================================================
// Types
// ============================================================

type SuccessResult = {
  success: true;
  jobDescription: string;
};

type ErrorResult = {
  success: false;
  error: string;
};

export type FetchJobDescriptionResult = SuccessResult | ErrorResult;

type BrightDataJsonResponse = {
  body?: unknown;
  data?: unknown;
  status_code?: number;
  message?: string;
  error?: string;
};

type OpenAIOutputContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  type?: string;
  content?: OpenAIOutputContent[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: OpenAIOutputItem[];
};

// ============================================================
// URL validation
// ============================================================

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// ============================================================
// HTML cleanup
// ============================================================

const cleanHtml = (html: string): string => {
  return (
    html
      // Remove scripts, styles, noscript and SVGs.
      .replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ")

      // Remove HTML comments.
      .replace(/<!--[\s\S]*?-->/g, " ")

      // Add line breaks around block elements.
      .replace(/<\/(p|div|section|article|main|header|footer|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")

      // Remove remaining HTML tags.
      .replace(/<[^>]+>/g, " ")

      // Decode common entities.
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")

      // Normalize spaces.
      .replace(/[ \t]+/g, " ")

      // Normalize excessive line breaks.
      .replace(/\n\s*\n+/g, "\n")

      .trim()
  );
};

// ============================================================
// Extract Bright Data content
// ============================================================

const extractBrightDataContent = (responseText: string): string => {
  const trimmed = responseText.trim();

  if (!trimmed) {
    return "";
  }

  // ----------------------------------------------------------
  // Raw HTML / Markdown response
  // ----------------------------------------------------------

  if (trimmed.startsWith("<") || trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    return trimmed;
  }

  // ----------------------------------------------------------
  // Try JSON response
  // ----------------------------------------------------------

  try {
    const parsed = JSON.parse(trimmed) as BrightDataJsonResponse;

    if (typeof parsed.body === "string" && parsed.body.trim()) {
      return parsed.body;
    }

    if (typeof parsed.data === "string" && parsed.data.trim()) {
      return parsed.data;
    }

    if (typeof parsed.error === "string" && parsed.error.trim()) {
      throw new Error(parsed.error);
    }

    if (typeof parsed.message === "string" && parsed.message.trim()) {
      throw new Error(parsed.message);
    }
  } catch (error) {
    // If the response looks like JSON,
    // preserve the actual parsing/API error.
    const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[");

    if (looksLikeJson) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Bright Data returned an invalid JSON response.");
    }

    // Otherwise treat it as raw content.
  }

  return trimmed;
};

// ============================================================
// Fetch job page through Bright Data
// ============================================================

const fetchJobPage = async (jobUrl: string): Promise<string> => {
  const apiKey = process.env.BRIGHTDATA_API_KEY;

  const zone = process.env.BRIGHTDATA_ZONE;

  if (!apiKey) {
    throw new Error("BRIGHTDATA_API_KEY is not configured.");
  }

  if (!zone) {
    throw new Error("BRIGHTDATA_ZONE is not configured.");
  }

  const response = await fetch(BRIGHTDATA_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${apiKey}`,

      Accept: "application/json, text/plain, text/html, */*",
    },

    body: JSON.stringify({
      zone,
      url: jobUrl,
      format: "raw",
      data_format: "markdown",
    }),

    cache: "no-store",
  });

  // IMPORTANT:
  // Bright Data can return raw HTML/text.
  // Therefore do NOT call response.json() here.
  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = responseText.replace(/\s+/g, " ").trim();

    if (errorMessage.length > 500) {
      errorMessage = errorMessage.slice(0, 500) + "...";
    }

    throw new Error(
      `Bright Data returned HTTP ${response.status}${errorMessage ? `: ${errorMessage}` : "."}`,
    );
  }

  const content = extractBrightDataContent(responseText);

  if (!content.trim()) {
    throw new Error("Bright Data returned an empty job page.");
  }

  return content;
};

// ============================================================
// Extract OpenAI text
// ============================================================

const extractOpenAIText = (result: OpenAIResponse): string => {
  // ----------------------------------------------------------
  // Preferred Responses API convenience field
  // ----------------------------------------------------------

  if (typeof result.output_text === "string" && result.output_text.trim()) {
    return result.output_text.trim();
  }

  // ----------------------------------------------------------
  // Fallback: extract from output[].content[]
  // ----------------------------------------------------------

  const text = result.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && typeof content.text === "string")
    .map((content) => content.text!.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();

  return text ?? "";
};

// ============================================================
// Generate polished job description
// ============================================================

const generateJobDescription = async (pageText: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  // Prevent an unnecessarily large request.
  const trimmedText = pageText.slice(0, 50000);

  const prompt = `
You are an expert job-posting information extractor.

The following content comes from a public job posting webpage.

Your task is to turn it into ONE clean, accurate, professional job description that can later be used by an AI resume optimizer.

IMPORTANT RULES:

- Do not invent information.
- Do not add requirements that are not present.
- Ignore navigation.
- Ignore advertisements.
- Ignore cookie notices.
- Ignore menus.
- Ignore footer content.
- Ignore unrelated job recommendations.
- Ignore website boilerplate.
- Preserve important job-specific information.
- Include the job title when available.
- Include the company when available.
- Include the location when available.
- Include employment type when available.
- Include the main job description.
- Include responsibilities.
- Include required skills.
- Include qualifications.
- Include preferred qualifications when available.
- Include experience requirements when available.
- Include important technologies, tools, frameworks, certifications, and keywords.
- Include salary information when available.
- Include benefits when clearly provided.
- If information is unavailable, omit it.
- Never guess missing information.
- Do not mention Bright Data.
- Do not mention scraping.
- Do not mention HTML.
- Do not mention extraction.
- Do not explain your process.
- Return only the polished job description.
- Keep the wording faithful to the original posting.
- Organize the result clearly with headings and bullet points where appropriate.

JOB POSTING CONTENT:

${trimmedText}
`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${apiKey}`,
    },

    body: JSON.stringify({
      model: "gpt-5.6",
      input: prompt,
    }),

    cache: "no-store",
  });

  const responseText = await response.text();

  // ----------------------------------------------------------
  // OpenAI API error
  // ----------------------------------------------------------

  if (!response.ok) {
    let errorMessage = responseText.replace(/\s+/g, " ").trim();

    if (errorMessage.length > 500) {
      errorMessage = errorMessage.slice(0, 500) + "...";
    }

    throw new Error(
      `OpenAI returned HTTP ${response.status}${errorMessage ? `: ${errorMessage}` : "."}`,
    );
  }

  // ----------------------------------------------------------
  // Parse OpenAI response
  // ----------------------------------------------------------

  let result: OpenAIResponse;

  try {
    result = JSON.parse(responseText) as OpenAIResponse;
  } catch {
    throw new Error("OpenAI returned an invalid JSON response.");
  }

  // ----------------------------------------------------------
  // Extract generated text
  // ----------------------------------------------------------

  const jobDescription = extractOpenAIText(result);

  if (!jobDescription) {
    console.error("OpenAI response did not contain output text:", JSON.stringify(result, null, 2));

    throw new Error("OpenAI returned an empty job description.");
  }

  return jobDescription;
};

// ============================================================
// Main Server Action
// ============================================================

export async function fetchJobDescriptionFromUrl(url: string): Promise<FetchJobDescriptionResult> {
  const jobUrl = url.trim();

  // ----------------------------------------------------------
  // Empty URL
  // ----------------------------------------------------------

  if (!jobUrl) {
    return {
      success: false,
      error: "Please provide a job posting URL.",
    };
  }

  // ----------------------------------------------------------
  // Invalid URL
  // ----------------------------------------------------------

  if (!isValidHttpUrl(jobUrl)) {
    return {
      success: false,
      error: "Please provide a valid HTTP or HTTPS job posting URL.",
    };
  }

  try {
    console.log(`Fetching job page through Bright Data: ${jobUrl}`);

    // --------------------------------------------------------
    // 1. Fetch job page
    // --------------------------------------------------------

    const rawPage = await fetchJobPage(jobUrl);

    console.log(`Bright Data response received. Content length: ${rawPage.length}`);

    // --------------------------------------------------------
    // 2. Clean page content
    // --------------------------------------------------------

    const pageText = cleanHtml(rawPage);

    console.log(`Cleaned job page content length: ${pageText.length}`);

    if (pageText.length < 100) {
      return {
        success: false,
        error: "The job page did not contain enough readable information.",
      };
    }

    // --------------------------------------------------------
    // 3. Generate polished job description with OpenAI
    // --------------------------------------------------------

    const jobDescription = await generateJobDescription(pageText);

    // --------------------------------------------------------
    // 4. Final validation
    // --------------------------------------------------------

    if (!jobDescription.trim()) {
      return {
        success: false,
        error: "We couldn't generate a usable job description from this posting.",
      };
    }

    console.log("Job description generated successfully.");

    return {
      success: true,
      jobDescription: jobDescription.trim(),
    };
  } catch (error) {
    console.error("Job page fetch failed:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Unable to fetch and process this job posting.",
    };
  }
}
