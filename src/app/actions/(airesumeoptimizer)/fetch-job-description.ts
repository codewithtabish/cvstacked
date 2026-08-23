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

type BrightDataResponse = {
  data?: string;
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
      // Remove scripts and styles.
      .replace(/<(script|style|noscript|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      // Remove comments.
      .replace(/<!--[\s\S]*?-->/g, " ")
      // Convert common block elements to line breaks.
      .replace(/<\/(p|div|section|article|main|header|footer|li|h1|h2|h3|h4|h5|h6|br)>/gi, "\n")
      // Remove remaining HTML tags.
      .replace(/<[^>]+>/g, " ")
      // Decode a few common entities.
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      // Normalize whitespace.
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n+/g, "\n")
      .trim()
  );
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
    },
    body: JSON.stringify({
      zone,
      url: jobUrl,
      format: "raw",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Bright Data returned HTTP ${response.status}: ${errorText.slice(0, 500)}`);
  }

  const result = (await response.json()) as BrightDataResponse;

  if (!result.data) {
    throw new Error("Bright Data returned an empty response.");
  }

  return result.data;
};

const generateJobDescription = async (pageText: string): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const trimmedText = pageText.slice(0, 50000);

  const prompt = `
You are an expert job-posting information extractor.

The following content was scraped from a job posting webpage.

Your task is to turn it into one clean, accurate, professional job description that can later be used by an AI resume optimizer.

IMPORTANT RULES:

- Do not invent information.
- Do not add requirements that are not present.
- Ignore navigation, advertisements, cookie notices, menus, footer content, unrelated recommendations, and website boilerplate.
- Preserve important job-specific information.
- If the company name is available, include it.
- If the job title is available, include it.
- If the location is available, include it.
- Include employment type when available.
- Include responsibilities.
- Include required skills.
- Include qualifications.
- Include preferred qualifications when available.
- Include experience requirements when available.
- Include important technologies, tools, frameworks, certifications, and keywords.
- If salary information is available, include it.
- If some information is unavailable, simply omit it.
- Do not mention that the information was scraped.
- Do not explain your process.
- Return only the polished job description.
- Keep the wording faithful to the original posting.

JOB PAGE CONTENT:

${trimmedText}
`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      input: prompt,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`OpenAI returned HTTP ${response.status}: ${errorText.slice(0, 500)}`);
  }

  const result = (await response.json()) as {
    output_text?: string;
  };

  const jobDescription = result.output_text?.trim();

  if (!jobDescription) {
    throw new Error("OpenAI returned an empty job description.");
  }

  return jobDescription;
};

export async function fetchJobDescriptionFromUrl(url: string): Promise<FetchJobDescriptionResult> {
  const jobUrl = url.trim();

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

    const rawPage = await fetchJobPage(jobUrl);

    const pageText = cleanHtml(rawPage);

    if (pageText.length < 100) {
      return {
        success: false,
        error: "The job page did not contain enough readable information.",
      };
    }

    console.log(`Job page fetched successfully. Content length: ${pageText.length}`);

    const jobDescription = await generateJobDescription(pageText);

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
