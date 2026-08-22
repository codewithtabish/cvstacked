// ============================================================
// Typed content for the ResumeFlow landing page.
// Presentation components consume this data — no copy lives in JSX.
// In production this can be swapped for data fetched from the API/DB.
// ============================================================

export type NavItem = { label: string; href: string };

export const navigationItems: NavItem[] = [
  { label: "Product", href: "#product" },
  { label: "AI Resume", href: "#job-tailoring" },
  { label: "Templates", href: "#templates" },
  { label: "Cover Letters", href: "#cover-letters" },
  { label: "Pricing", href: "#pricing" },
];

// ---------- Stats ----------
export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "50K+", label: "Resumes created" },
  { value: "92%", label: "Avg. match improvement" },
  { value: "4.9/5", label: "User rating" },
  { value: "3 min", label: "Avg. time to tailor a resume" },
];

// ---------- Resume templates ----------
export type ResumeTemplateId =
  "aurora" | "atlas" | "nova" | "vertex" | "monarch" | "executive";

export type ResumeTemplate = {
  id: ResumeTemplateId;
  name: string;
  category: string;
  description: string;
};

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "aurora",
    name: "Aurora",
    category: "Modern",
    description: "Clean two-column layout with a soft accent rail.",
  },
  {
    id: "atlas",
    name: "Atlas",
    category: "Executive",
    description: "Confident serif headers built for leadership roles.",
  },
  {
    id: "nova",
    name: "Nova",
    category: "Technical",
    description: "Dense, scannable layout for engineering resumes.",
  },
  {
    id: "vertex",
    name: "Vertex",
    category: "Minimal",
    description: "Generous whitespace and understated structure.",
  },
  {
    id: "monarch",
    name: "Monarch",
    category: "Creative",
    description: "Distinct typography for design-led profiles.",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Classic",
    description: "Traditional single-column format ATS engines trust.",
  },
];

// ---------- Cover letter templates ----------
export type CoverLetterTemplateId =
  "classic" | "modern" | "executive" | "minimal" | "professional";

export type CoverLetterTemplate = {
  id: CoverLetterTemplateId;
  name: string;
  description: string;
};

export const coverLetterTemplates: CoverLetterTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Formal structure, safe for any industry.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Confident opening line, tighter paragraphs.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Leadership tone for senior roles.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Short and direct, three paragraphs.",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Balanced tone for corporate applications.",
  },
];

// ---------- Tone options ----------
export const toneOptions = [
  "Professional",
  "Confident",
  "Concise",
  "Warm",
] as const;

// ---------- Features (bento) ----------
export type Feature = {
  id: string;
  title: string;
  description: string;
  size: "lg" | "md" | "sm";
};

export const features: Feature[] = [
  {
    id: "ai-tailoring",
    title: "AI job tailoring",
    description:
      "Paste any job description and ResumeFlow rewrites your resume to match it — keywords, skills, and phrasing included.",
    size: "lg",
  },
  {
    id: "ats",
    title: "ATS analyzer",
    description:
      "See a formatting and keyword score before you apply, with specific fixes.",
    size: "md",
  },
  {
    id: "templates",
    title: "Professional templates",
    description:
      "Ten layouts built for different industries and seniority levels.",
    size: "md",
  },
  {
    id: "cover-letters",
    title: "AI cover letters",
    description:
      "Generate a matching cover letter from your resume and the job post.",
    size: "sm",
  },
  {
    id: "import",
    title: "Import your resume",
    description: "Upload a PDF or DOCX and start editing in minutes.",
    size: "sm",
  },
  {
    id: "tracker",
    title: "Application tracker",
    description:
      "Keep every application, resume version, and stage in one board.",
    size: "sm",
  },
];

// ---------- Workflow ----------
export type WorkflowStep = {
  number: string;
  title: string;
  description: string;
};

export const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    title: "Build your master resume",
    description:
      "Add every role, skill, and project once. This becomes your source of truth.",
  },
  {
    number: "02",
    title: "Paste the job description",
    description: "Drop in a posting from anywhere — no formatting required.",
  },
  {
    number: "03",
    title: "AI analyzes the role",
    description:
      "ResumeFlow reads the requirements and ranks what matters most.",
  },
  {
    number: "04",
    title: "Keywords are identified",
    description:
      "Skills and terms the ATS is scanning for are surfaced automatically.",
  },
  {
    number: "05",
    title: "Your resume is tailored",
    description: "Bullet points are rewritten and reordered to match the role.",
  },
  {
    number: "06",
    title: "A cover letter is drafted",
    description:
      "Generated from your tailored resume and the job post, in your chosen tone.",
  },
  {
    number: "07",
    title: "Download and apply",
    description: "Export a clean PDF and submit with confidence.",
  },
];

// ---------- How it works (4-step) ----------
export type HowStep = { number: string; title: string; description: string };

export const howItWorksSteps: HowStep[] = [
  {
    number: "01",
    title: "Create",
    description:
      "Build your master resume from scratch or import an existing one.",
  },
  {
    number: "02",
    title: "Customize",
    description: "Choose a professional template that fits your industry.",
  },
  {
    number: "03",
    title: "Tailor",
    description:
      "Paste a job description and let AI optimize your resume for it.",
  },
  {
    number: "04",
    title: "Apply",
    description:
      "Generate your cover letter and track the application through to offer.",
  },
];

// ---------- Comparison ----------
export const traditionalApproach = [
  "Start from a blank document",
  "Format manually, section by section",
  "One resume for every job",
  "Guess which keywords the ATS wants",
  "Write every cover letter from scratch",
  "Track applications in a separate spreadsheet",
];

export const resumeflowApproach = [
  "Start from a guided builder",
  "Choose a professional template",
  "AI tailors your resume to each job",
  "ATS analysis shows exactly what's missing",
  "AI drafts a matching cover letter",
  "Applications tracked in one workspace",
];

// ---------- Testimonials ----------
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I used to spend an hour rewriting my resume for every job. Now I can tailor one in minutes and actually apply to more roles.",
    name: "Sarah M.",
    role: "Product Designer",
    initials: "SM",
  },
  {
    quote:
      "The ATS feedback immediately showed me what was missing from my resume. Two fixes later, my callback rate noticeably improved.",
    name: "Daniel R.",
    role: "Software Engineer",
    initials: "DR",
  },
  {
    quote:
      "Having every version of my resume and every application in one place made my job search feel manageable for the first time.",
    name: "Priya K.",
    role: "Marketing Manager",
    initials: "PK",
  },
  {
    quote:
      "The cover letter generator actually reads the job post. It's not generic filler — it references the role directly.",
    name: "Marcus T.",
    role: "Data Analyst",
    initials: "MT",
  },
  {
    quote:
      "I imported my old resume and it kept the structure I liked while cleaning up formatting I'd been fighting for years.",
    name: "Elena V.",
    role: "Operations Lead",
    initials: "EV",
  },
  {
    quote:
      "Switching templates without retyping anything is the feature I didn't know I needed.",
    name: "Jonah B.",
    role: "Account Executive",
    initials: "JB",
  },
];

// ---------- Pricing ----------
export type PricingPlan = {
  id: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    description: "Get a professional resume started.",
    features: ["1 resume", "3 templates", "Basic AI suggestions", "PDF export"],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$16",
    yearlyPrice: "$12",
    description: "For an active job search.",
    features: [
      "Unlimited resumes",
      "All templates",
      "AI job tailoring",
      "ATS analysis",
      "AI cover letters",
      "Application tracker",
    ],
    highlighted: true,
    cta: "Start Pro trial",
  },
  {
    id: "career",
    name: "Career",
    monthlyPrice: "$29",
    yearlyPrice: "$22",
    description: "For a serious career transition.",
    features: [
      "Everything in Pro",
      "Advanced AI optimization",
      "Unlimited cover letters",
      "Advanced analytics",
      "Priority AI processing",
    ],
    cta: "Start Career trial",
  },
];

// ---------- FAQ ----------
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "What is an AI resume builder?",
    answer:
      "ResumeFlow is a guided resume builder that uses AI to help you write stronger content, tailor your resume to a specific job, and check how well it will perform with applicant tracking systems.",
  },
  {
    question: "Can I upload my existing resume?",
    answer:
      "Yes. Upload a PDF or DOCX and ResumeFlow imports the content into an editable, structured resume.",
  },
  {
    question: "Can I import a PDF?",
    answer:
      "PDF and DOCX imports are both supported. Sections are detected automatically and can be edited afterward.",
  },
  {
    question: "Can I create multiple resumes?",
    answer:
      "Pro and Career plans support unlimited resumes, so you can keep a tailored version for each application.",
  },
  {
    question: "How does AI job tailoring work?",
    answer:
      "Paste a job description and ResumeFlow compares it to your resume, highlights missing keywords and skills, and rewrites relevant bullet points to match the role.",
  },
  {
    question: "What is ATS optimization?",
    answer:
      "Applicant tracking systems scan resumes for keywords and formatting before a person sees them. ResumeFlow scores your resume against a job description and flags what to fix.",
  },
  {
    question: "Can I generate cover letters?",
    answer:
      "Yes. Cover letters are generated from your resume and the job description, in a tone you choose.",
  },
  {
    question: "Can I customize resume templates?",
    answer:
      "Every template supports layout, section order, and styling changes without leaving the builder.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer:
      "All plans include PDF export, formatted for both screen review and printing.",
  },
  {
    question: "Is my resume data private?",
    answer:
      "Your resumes and application data are private to your account and are never shared or sold.",
  },
  {
    question: "Can I use ResumeFlow for different careers?",
    answer:
      "Templates and AI suggestions adapt to your industry, whether you're in tech, design, operations, or elsewhere.",
  },
  {
    question: "Do I need a credit card?",
    answer:
      "No. The Free plan doesn't require a credit card, and trials on paid plans can be cancelled anytime.",
  },
];

// ---------- Application tracker (demo) ----------
export type ApplicationStage =
  "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";

export type Application = {
  company: string;
  position: string;
  date: string;
  resumeUsed: string;
  stage: ApplicationStage;
};

export const applicationStages: ApplicationStage[] = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export const applications: Application[] = [
  {
    company: "Northwind Labs",
    position: "Senior Frontend Engineer",
    date: "Aug 12",
    resumeUsed: "Nova — Tech",
    stage: "Interview",
  },
  {
    company: "Fieldstone",
    position: "Product Designer",
    date: "Aug 15",
    resumeUsed: "Aurora — Design",
    stage: "Applied",
  },
  {
    company: "Harbor & Co.",
    position: "UX Researcher",
    date: "Aug 9",
    resumeUsed: "Vertex — Base",
    stage: "Offer",
  },
  {
    company: "Meridian",
    position: "Frontend Engineer",
    date: "Aug 18",
    resumeUsed: "Nova — Tech",
    stage: "Saved",
  },
  {
    company: "Circuit Studio",
    position: "Design Systems Lead",
    date: "Jul 30",
    resumeUsed: "Monarch — Creative",
    stage: "Rejected",
  },
];

export const trackerAnalytics = [
  { label: "Applications", value: "12" },
  { label: "Interviews", value: "4" },
  { label: "Offers", value: "2" },
];

// ---------- Job tailoring demo ----------
export const jobTailoringDemo = {
  jobTitle: "Senior Frontend Engineer",
  jobBody:
    "We are looking for an experienced frontend engineer with strong React, TypeScript, Next.js, accessibility and testing experience.",
  matchBefore: 92,
  matchAfter: 97,
  detected: ["React", "TypeScript", "Next.js", "Testing", "Performance"],
  missing: ["Accessibility"],
};

// ---------- ATS demo ----------
export const atsBreakdown = [
  { label: "Keyword match", value: 94 },
  { label: "Experience match", value: 91 },
  { label: "Skills match", value: 89 },
  { label: "Formatting", value: 98 },
];

export const atsStrengths = [
  "Strong keyword coverage",
  "Relevant experience",
  "Clear structure",
];
export const atsSuggestions = [
  "Add accessibility experience",
  "Quantify two achievements",
];

// ---------- AI writing demo ----------
export const writingBefore = "Worked on website development.";
export const writingAfter =
  "Built and optimized responsive Next.js applications, improving performance and delivering reusable UI components across product surfaces.";
export const writingControls = [
  "Improve",
  "Shorten",
  "Make measurable",
  "Match job",
];

// ---------- Upload flow ----------
export const uploadSteps = [
  "Analyzing",
  "Extracting sections",
  "Resume imported",
  "Ready to edit",
];
