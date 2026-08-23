"use server";

const BRIGHTDATA_API_URL = "https://api.brightdata.com/request";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";

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

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const cleanHtml = (html: string): string => {
  return (
    html
      // Remove scripts, styles, SVGs and noscript content.
      .replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ")

      // Remove HTML comments.
      .replace(/<!--[\s\S]*?-->/g, " ")

      // Add line breaks around common block elements.
      .replace(/<\/(p|div|section|article|main|header|footer|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")

      // Remove remaining HTML tags.
      .replace(/<[^>]+>/g, " ")

      // Decode common HTML entities.
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")

      // Normalize whitespace.
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n+/g, "\n")

      .trim()
  );
};

const extractBrightDataContent = (rawResponse: string): string => {
  const trimmedResponse = rawResponse.trim();

  if (!trimmedResponse) {
    return "";
  }

  // ------------------------------------------------------------
  // Bright Data may return the actual page directly.
  // ------------------------------------------------------------

  if (
    trimmedResponse.startsWith("<") ||
    trimmedResponse.startsWith("<!DOCTYPE") ||
    trimmedResponse.startsWith("<html")
  ) {
    return trimmedResponse;
  }

  // ------------------------------------------------------------
  // It may also return a JSON envelope.
  // ------------------------------------------------------------

  try {
    const parsed = JSON.parse(trimmedResponse) as BrightDataJsonResponse;

    if (typeof parsed.body === "string" && parsed.body.trim()) {
      return parsed.body;
    }

    if (typeof parsed.data === "string" && parsed.data.trim()) {
      return parsed.data;
    }

    if (parsed.error && parsed.error.trim()) {
      throw new Error(parsed.error);
    }

    if (parsed.message && parsed.message.trim()) {
      throw new Error(parsed.message);
    }
  } catch (error) {
    // If it isn't JSON, treat it as raw page content.
    if (error instanceof Error && error.message !== "Unexpected end of JSON input") {
      const looksLikeJson = trimmedResponse.startsWith("{") || trimmedResponse.startsWith("[");

      if (looksLikeJson) {
        throw error;
      }
    }
  }

  return trimmedResponse;
};

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

const generateJobDescription = async (pageText: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const trimmedText = pageText.slice(0, 50000);

  const prompt = `
You are an expert job-posting information extractor.

The following content comes from a public job posting webpage.

Your task is to turn it into ONE clean, accurate, professional job description that can later be used by an AI resume optimizer.

IMPORTANT RULES:

- Do not invent information.
- Do not add requirements that are not present.
- Ignore navigation, advertisements, cookie notices, menus, footer content, unrelated recommendations, and website boilerplate.
- Preserve important job-specific information.
- Identify the job title when available.
- Identify the company when available.
- Identify the location when available.
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
- If some information is unavailable, omit it.
- Do not guess missing information.
- Do not mention scraping, Bright Data, HTML, extraction, or this instruction.
- Do not explain your process.
- Return only the polished job description.
- Keep the wording faithful to the original posting.
- Organize the information clearly with headings and bullet points where appropriate.

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
      model: "gpt-5",
      input: prompt,
    }),
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = responseText.replace(/\s+/g, " ").trim();

    if (errorMessage.length > 500) {
      errorMessage = errorMessage.slice(0, 500) + "...";
    }

    throw new Error(
      `OpenAI returned HTTP ${response.status}${errorMessage ? `: ${errorMessage}` : "."}`,
    );
  }

  let result: {
    output_text?: string;
  };

  try {
    result = JSON.parse(responseText) as {
      output_text?: string;
    };
  } catch {
    throw new Error("OpenAI returned an invalid JSON response.");
  }

  const jobDescription = result.output_text?.trim();

  if (!jobDescription) {
    throw new Error("OpenAI returned an empty job description.");
  }

  return jobDescription;
};

export async function fetchJobDescriptionFromUrl(url: string): Promise<FetchJobDescriptionResult> {
  const jobUrl = url.trim();

  // ------------------------------------------------------------
  // Validate URL
  // ------------------------------------------------------------

  if (!jobUrl) {
    return {
      success: false,
      error: "Please provide a job posting URL.",
    };
  }

  if (!isValidHttpUrl(jobUrl)) {
    return {
      success: false,
      error: "Please provide a valid HTTP or HTTPS job posting URL.",
    };
  }

  try {
    console.log(`Fetching job page through Bright Data: ${jobUrl}`);

    // ----------------------------------------------------------
    // Fetch page
    // ----------------------------------------------------------

    const rawPage = await fetchJobPage(jobUrl);

    console.log(`Bright Data response received. Content length: ${rawPage.length}`);

    // ----------------------------------------------------------
    // Convert HTML/Markdown into readable text
    // ----------------------------------------------------------

    const pageText = cleanHtml(rawPage);

    console.log(`Cleaned job page content length: ${pageText.length}`);

    if (pageText.length < 100) {
      return {
        success: false,
        error: "The job page did not contain enough readable information.",
      };
    }

    // ----------------------------------------------------------
    // Generate polished job description
    // ----------------------------------------------------------

    const jobDescription = await generateJobDescription(pageText);

    if (!jobDescription.trim()) {
      return {
        success: false,
        error: "We couldn't generate a usable job description from this posting.",
      };
    }

    console.log("Job description generated successfully.");

    return {
      success: true,
      jobDescription,
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
