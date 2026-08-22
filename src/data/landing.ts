// data/landing.ts

export const navigationItems = [
  { title: "Product", href: "#features" },
  { title: "AI Resume", href: "#ai-tailoring" },
  { title: "Templates", href: "#templates" },
  { title: "Cover Letters", href: "#cover-letters" },
  { title: "Pricing", href: "#pricing" },
];

export const resumeTemplates = [
  {
    id: "aurora",
    name: "Aurora",
    category: "Modern",
    description: "Clean modern layout with strong hierarchy",
  },
  {
    id: "atlas",
    name: "Atlas",
    category: "Professional",
    description: "Classic professional with balanced spacing",
  },
  {
    id: "nova",
    name: "Nova",
    category: "Minimal",
    description: "Ultra-minimal with elegant typography",
  },
  {
    id: "vertex",
    name: "Vertex",
    category: "Technical",
    description: "Technical focus with clear sections",
  },
  {
    id: "monarch",
    name: "Monarch",
    category: "Executive",
    description: "Executive presence and authority",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Executive",
    description: "Polished leadership-focused design",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimal",
    description: "Sparse and refined",
  },
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    description: "Contemporary with subtle accent",
  },
  {
    id: "technical",
    name: "Technical",
    category: "Technical",
    description: "Engineer-friendly structure",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Distinctive creative layout",
  },
];

export const coverLetterTemplates = [
  { id: "classic", name: "Classic", category: "Traditional" },
  { id: "modern", name: "Modern", category: "Contemporary" },
  { id: "executive", name: "Executive", category: "Leadership" },
  { id: "minimal", name: "Minimal", category: "Clean" },
  { id: "professional", name: "Professional", category: "Business" },
];

export const features = [
  {
    title: "AI Resume Builder",
    description:
      "Build a polished master resume with guided sections and professional templates.",
    icon: "FileText",
  },
  {
    title: "AI Job Tailoring",
    description:
      "Paste any job description and let AI adapt your resume to match the role.",
    icon: "Sparkles",
  },
  {
    title: "ATS Analyzer",
    description:
      "See keyword match, formatting score, and actionable improvements before you apply.",
    icon: "BarChart3",
  },
  {
    title: "Resume Templates",
    description:
      "Choose from professionally designed templates that look great and pass ATS checks.",
    icon: "Layout",
  },
  {
    title: "AI Cover Letters",
    description:
      "Generate a tailored cover letter that tells the same story as your resume.",
    icon: "Mail",
  },
  {
    title: "Application Tracker",
    description:
      "Track every application from saved to offer in one clean workspace.",
    icon: "Kanban",
  },
  {
    title: "Resume Import",
    description:
      "Upload PDF or DOCX and turn it into an editable, polished resume in seconds.",
    icon: "Upload",
  },
  {
    title: "Multiple Versions",
    description:
      "Keep one master resume and create job-specific versions without starting over.",
    icon: "Copy",
  },
  {
    title: "Professional Export",
    description: "Export clean, ATS-friendly PDFs ready to send.",
    icon: "Download",
  },
];

export const workflowSteps = [
  {
    number: "01",
    title: "Build your master resume",
    description:
      "Choose a template and fill in experience, education, skills, and achievements.",
  },
  {
    number: "02",
    title: "Paste the job description",
    description:
      "Drop in the role you’re targeting so AI can understand what matters.",
  },
  {
    number: "03",
    title: "AI analyzes the role",
    description:
      "Keywords, skills, and requirements are extracted and matched against your content.",
  },
  {
    number: "04",
    title: "AI tailors your resume",
    description:
      "Suggestions appear for stronger bullets, missing keywords, and clearer impact.",
  },
  {
    number: "05",
    title: "AI generates a cover letter",
    description: "A matching letter is created in the tone you choose.",
  },
  {
    number: "06",
    title: "Download and apply",
    description: "Export polished PDFs and track the application in one place.",
  },
];

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Everything you need to get started.",
    features: [
      "Basic resume builder",
      "Limited templates",
      "Basic AI suggestions",
      "PDF export",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 19, yearly: 15 },
    description: "For serious job seekers who apply often.",
    features: [
      "Unlimited resumes",
      "All templates",
      "AI job tailoring",
      "ATS analysis",
      "AI cover letters",
      "Application tracker",
    ],
    highlighted: true,
  },
  {
    id: "career",
    name: "Career",
    price: { monthly: 39, yearly: 29 },
    description: "Advanced tools for power users.",
    features: [
      "Everything in Pro",
      "Advanced AI optimization",
      "Unlimited cover letters",
      "Advanced analytics",
      "Priority AI processing",
    ],
    highlighted: false,
  },
];

export const testimonials = [
  {
    quote:
      "I used to spend an hour rewriting my resume for every job. Now I can tailor one in minutes.",
    name: "Sarah M.",
    role: "Product Designer",
    initials: "SM",
  },
  {
    quote:
      "The ATS feedback immediately showed me what was missing from my resume.",
    name: "Daniel R.",
    role: "Software Engineer",
    initials: "DR",
  },
  {
    quote:
      "The cover letter matched my resume tone perfectly. It felt like one coherent application.",
    name: "Priya K.",
    role: "Marketing Manager",
    initials: "PK",
  },
  {
    quote:
      "Clean templates, real AI suggestions, and an actual tracker. Finally one tool that covers the whole process.",
    name: "Marcus L.",
    role: "Engineering Manager",
    initials: "ML",
  },
];

export const faqItems = [
  {
    question: "What is an AI resume builder?",
    answer:
      "An AI resume builder helps you create, improve, and tailor resumes using intelligent suggestions for content, keywords, and structure while keeping full control over the final result.",
  },
  {
    question: "Can I upload my existing resume?",
    answer:
      "Yes. Upload PDF or DOCX and the content is extracted into an editable resume you can refine and tailor.",
  },
  {
    question: "Can I import a PDF?",
    answer:
      "Yes. PDF import is supported and turns your document into structured, editable sections.",
  },
  {
    question: "Can I create multiple resumes?",
    answer:
      "Yes. Keep a master resume and create as many job-specific versions as you need.",
  },
  {
    question: "How does AI job tailoring work?",
    answer:
      "You paste a job description. AI analyzes required skills and keywords, compares them to your resume, and suggests targeted improvements.",
  },
  {
    question: "What is ATS optimization?",
    answer:
      "ATS optimization helps your resume pass automated screening by improving keyword coverage, structure, and formatting clarity.",
  },
  {
    question: "Can I generate cover letters?",
    answer:
      "Yes. Generate tailored cover letters that match your resume and the specific job, with control over tone and template.",
  },
  {
    question: "Can I customize resume templates?",
    answer:
      "Yes. Choose a professional template and adjust layout, sections, and content while keeping a clean, ATS-friendly structure.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer: "Yes. Export clean, professional PDFs ready to send.",
  },
  {
    question: "Is my resume data private?",
    answer:
      "Your data is treated as private. You control what you create and export. Review the privacy policy for full details.",
  },
  {
    question: "Can I use ResumeFlow for different careers?",
    answer:
      "Yes. The templates and AI work across industries — engineering, design, product, marketing, and more.",
  },
  {
    question: "Do I need a credit card?",
    answer: "No. You can start with the free plan without a credit card.",
  },
];

export const stats = [
  { value: "50K+", label: "Resumes created" },
  { value: "92%", label: "Avg. match improvement" },
  { value: "4.9/5", label: "User rating" },
  { value: "50+", label: "Professional templates" },
];

export const applicationStages = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];
