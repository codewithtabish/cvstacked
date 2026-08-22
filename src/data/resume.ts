// resume.ts

export type ResumeTemplate =
  "modern" | "professional" | "minimal" | "creative" | "executive";

export type ResumeSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "publications"
  | "volunteer"
  | "references"
  | "interests"
  | "custom";

export interface ResumePersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
  description?: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  role?: string;
  description: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
  achievements?: string[];
}

export interface ResumeCertification {
  title: string;
  organization: string;
  date: string | undefined;
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ResumeLanguage {
  language: string;
  level: string;
  id: string;
  name: string;
  proficiency:
    "elementary" | "conversational" | "professional" | "fluent" | "native";
}

export interface ResumeAward {
  name: string;
  organization: string;
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ResumePublication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ResumeVolunteer {
  position: string;
  achievements: any;
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface ResumeReference {
  id: string;
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  description?: string;
  items: {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }[];
}

export interface ResumeData {
  id: string;
  title: string;
  template: ResumeTemplate;
  accentColor: string;
  personal: ResumePersonalInfo;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  awards: ResumeAward[];
  publications: ResumePublication[];
  volunteer: ResumeVolunteer[];
  references: ResumeReference[];
  interests: string[];
  customSections: ResumeCustomSection[];
}

/* ============================================================
   RESUME 01 — SENIOR SOFTWARE ENGINEER
   ============================================================ */

export const seniorSoftwareEngineerResume: ResumeData = {
  id: "resume-software-engineer-001",
  title: "Senior Software Engineer Resume",
  template: "modern",
  accentColor: "#2563EB",

  personal: {
    firstName: "Alexander",
    lastName: "Morgan",
    jobTitle: "Senior Software Engineer",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    email: "alexander.morgan@example.com",
    phone: "+1 (415) 555-0198",
    location: "San Francisco, California",
    address: "San Francisco, CA, United States",
    website: "https://alexandermorgan.dev",
    linkedin: "https://linkedin.com/in/alexandermorgan",
    github: "https://github.com/alexandermorgan",
    portfolio: "https://alexandermorgan.dev",
  },

  summary:
    "Senior Software Engineer with 8+ years of experience designing and building scalable web platforms, distributed systems, and developer-focused products. Specialized in TypeScript, React, Next.js, Node.js, PostgreSQL, cloud infrastructure, and high-performance application architecture. Proven track record of leading engineering initiatives, mentoring developers, improving system reliability, and delivering products used by millions of users.",

  experience: [
    {
      id: "exp-alex-001",
      company: "Northstar Technologies",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      employmentType: "Full-time",
      startDate: "2022-03",
      current: true,
      achievements: [
        "Led architecture and development of a high-traffic SaaS platform serving more than 2.4 million monthly users.",
        "Reduced API response times by 42% through database optimization, caching, and query redesign.",
        "Designed a scalable Next.js and Node.js application architecture used across 12 product teams.",
        "Mentored 7 engineers and introduced engineering standards that reduced production regressions by 31%.",
        "Built event-driven services using PostgreSQL, Redis, queues, and cloud-native infrastructure.",
      ],
    },
    {
      id: "exp-alex-002",
      company: "Vertex Labs",
      position: "Software Engineer",
      location: "Austin, TX",
      employmentType: "Full-time",
      startDate: "2019-01",
      endDate: "2022-02",
      current: false,
      achievements: [
        "Developed customer-facing applications using React, TypeScript, Node.js, and PostgreSQL.",
        "Implemented reusable frontend architecture that reduced development time across multiple products.",
        "Built automated testing infrastructure that increased critical-path test coverage from 48% to 86%.",
        "Collaborated with product, design, and infrastructure teams to ship 20+ major product releases.",
      ],
    },
    {
      id: "exp-alex-003",
      company: "BrightStack",
      position: "Frontend Engineer",
      location: "Remote",
      employmentType: "Full-time",
      startDate: "2017-06",
      endDate: "2018-12",
      current: false,
      achievements: [
        "Built responsive web applications using React and modern JavaScript.",
        "Created reusable UI components and internal design-system primitives.",
        "Improved frontend performance and reduced initial page load time by 35%.",
      ],
    },
  ],

  education: [
    {
      id: "edu-alex-001",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Berkeley, California",
      startDate: "2013",
      endDate: "2017",
      grade: "3.8 / 4.0",
    },
  ],

  skills: [
    {
      id: "skill-001",
      name: "TypeScript",
      level: "expert",
      category: "Languages",
    },
    {
      id: "skill-002",
      name: "JavaScript",
      level: "expert",
      category: "Languages",
    },
    {
      id: "skill-003",
      name: "React",
      level: "expert",
      category: "Frontend",
    },
    {
      id: "skill-004",
      name: "Next.js",
      level: "expert",
      category: "Frontend",
    },
    {
      id: "skill-005",
      name: "Node.js",
      level: "expert",
      category: "Backend",
    },
    {
      id: "skill-006",
      name: "PostgreSQL",
      level: "advanced",
      category: "Database",
    },
    {
      id: "skill-007",
      name: "Redis",
      level: "advanced",
      category: "Infrastructure",
    },
    {
      id: "skill-008",
      name: "Docker",
      level: "advanced",
      category: "DevOps",
    },
    {
      id: "skill-009",
      name: "AWS",
      level: "advanced",
      category: "Cloud",
    },
    {
      id: "skill-010",
      name: "System Design",
      level: "expert",
      category: "Architecture",
    },
  ],

  projects: [
    {
      id: "project-alex-001",
      name: "Atlas Analytics Platform",
      role: "Lead Engineer",
      description:
        "Real-time analytics platform enabling enterprise teams to monitor product usage, revenue metrics, and operational performance from a unified dashboard.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "AWS",
      ],
      startDate: "2023",
      endDate: "2024",
      url: "https://example.com/atlas",
      github: "https://github.com/example/atlas",
      achievements: [
        "Processed more than 100 million events per month.",
        "Designed horizontally scalable ingestion architecture.",
        "Reduced dashboard query latency by 60%.",
      ],
    },
    {
      id: "project-alex-002",
      name: "OpenSource UI",
      role: "Creator",
      description:
        "Open-source component library for building accessible React applications with a consistent design language.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      startDate: "2021",
      url: "https://example.com/opensource-ui",
      github: "https://github.com/example/opensource-ui",
      achievements: [
        "Reached more than 8,000 GitHub stars.",
        "Adopted by hundreds of independent developers.",
      ],
    },
  ],

  certifications: [
    {
      id: "cert-alex-001",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2024",
      credentialId: "AWS-CSA-123456",
      credentialUrl: "https://example.com/certificate",
    },
    {
      id: "cert-alex-002",
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      issueDate: "2022",
      credentialId: "PSM-123456",
    },
  ],

  languages: [
    {
      id: "lang-alex-001",
      name: "English",
      proficiency: "native",
    },
    {
      id: "lang-alex-002",
      name: "Spanish",
      proficiency: "professional",
    },
  ],

  awards: [
    {
      id: "award-alex-001",
      title: "Engineering Excellence Award",
      issuer: "Northstar Technologies",
      date: "2024",
      description:
        "Recognized for technical leadership and outstanding contribution to platform reliability.",
    },
  ],

  publications: [
    {
      id: "pub-alex-001",
      title: "Designing Reliable Web Applications at Scale",
      publisher: "Tech Engineering Journal",
      date: "2024",
      url: "https://example.com/article",
      description:
        "A practical guide to building resilient web platforms using modern cloud architecture.",
    },
  ],

  volunteer: [
    {
      id: "vol-alex-001",
      organization: "Code for Community",
      role: "Volunteer Mentor",
      startDate: "2021",
      current: true,
      description:
        "Mentor early-career developers through open-source projects, technical workshops, and career guidance.",
    },
  ],

  references: [
    {
      id: "ref-alex-001",
      name: "Sophia Bennett",
      position: "VP of Engineering",
      company: "Northstar Technologies",
      email: "sophia.bennett@example.com",
      phone: "+1 (415) 555-0122",
      relationship: "Former Manager",
    },
  ],

  interests: [
    "Open Source",
    "Artificial Intelligence",
    "Photography",
    "Hiking",
    "Technology Writing",
  ],

  customSections: [],
};

/* ============================================================
   RESUME 02 — MEDICAL DOCTOR
   ============================================================ */

export const medicalDoctorResume: ResumeData = {
  id: "resume-doctor-001",
  title: "Medical Doctor Resume",
  template: "professional",
  accentColor: "#0F766E",

  personal: {
    firstName: "Sophia",
    lastName: "Anderson",
    jobTitle: "Internal Medicine Physician",
    photo:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
    email: "sophia.anderson@example.com",
    phone: "+1 (212) 555-0187",
    location: "New York, New York",
    address: "New York, NY, United States",
    website: "https://sophiaanderson.example.com",
    linkedin: "https://linkedin.com/in/sophiaanderson",
  },

  summary:
    "Board-certified Internal Medicine Physician with 9+ years of clinical experience delivering evidence-based, patient-centered care across hospital and outpatient settings. Experienced in complex diagnosis, chronic disease management, preventive medicine, clinical leadership, and multidisciplinary collaboration. Passionate about improving patient outcomes through compassionate care, clinical education, and continuous quality improvement.",

  experience: [
    {
      id: "exp-doctor-001",
      company: "New York Medical Center",
      position: "Attending Physician – Internal Medicine",
      location: "New York, NY",
      employmentType: "Full-time",
      startDate: "2021-07",
      current: true,
      achievements: [
        "Provide comprehensive medical care to adult patients across inpatient and outpatient settings.",
        "Manage complex cases involving cardiovascular, endocrine, respiratory, and metabolic conditions.",
        "Collaborate with multidisciplinary teams to develop individualized treatment plans.",
        "Supervise residents and medical students during clinical rotations.",
        "Participated in hospital quality-improvement initiatives that improved discharge coordination.",
      ],
    },
    {
      id: "exp-doctor-002",
      company: "St. Mary's Hospital",
      position: "Resident Physician",
      location: "Boston, MA",
      employmentType: "Full-time",
      startDate: "2017-07",
      endDate: "2021-06",
      current: false,
      achievements: [
        "Provided direct patient care under attending supervision.",
        "Managed acute and chronic medical conditions across multiple hospital departments.",
        "Presented patient cases during daily rounds and multidisciplinary conferences.",
        "Participated in clinical research and evidence-based medicine initiatives.",
      ],
    },
  ],

  education: [
    {
      id: "edu-doctor-001",
      institution: "Harvard Medical School",
      degree: "Doctor of Medicine",
      fieldOfStudy: "Medicine",
      location: "Boston, Massachusetts",
      startDate: "2013",
      endDate: "2017",
    },
    {
      id: "edu-doctor-002",
      institution: "University of Michigan",
      degree: "Bachelor of Science",
      fieldOfStudy: "Biology",
      location: "Ann Arbor, Michigan",
      startDate: "2009",
      endDate: "2013",
      grade: "Magna Cum Laude",
    },
  ],

  skills: [
    {
      id: "doctor-skill-001",
      name: "Clinical Diagnosis",
      level: "expert",
      category: "Clinical",
    },
    {
      id: "doctor-skill-002",
      name: "Patient Management",
      level: "expert",
      category: "Clinical",
    },
    {
      id: "doctor-skill-003",
      name: "Preventive Medicine",
      level: "advanced",
      category: "Clinical",
    },
    {
      id: "doctor-skill-004",
      name: "Electronic Health Records",
      level: "advanced",
      category: "Technology",
    },
    {
      id: "doctor-skill-005",
      name: "Clinical Research",
      level: "advanced",
      category: "Research",
    },
    {
      id: "doctor-skill-006",
      name: "Medical Education",
      level: "advanced",
      category: "Leadership",
    },
  ],

  projects: [
    {
      id: "doctor-project-001",
      name: "Hospital Readmission Reduction Initiative",
      role: "Clinical Lead",
      description:
        "Quality-improvement initiative focused on reducing preventable hospital readmissions among patients with chronic medical conditions.",
      technologies: ["Clinical Analytics", "EHR", "Quality Improvement"],
      startDate: "2023",
      achievements: [
        "Helped reduce 30-day readmission rates by 18%.",
        "Developed standardized post-discharge follow-up workflows.",
      ],
    },
  ],

  certifications: [
    {
      id: "doctor-cert-001",
      name: "Board Certification in Internal Medicine",
      issuer: "American Board of Internal Medicine",
      issueDate: "2022",
    },
    {
      id: "doctor-cert-002",
      name: "Advanced Cardiovascular Life Support",
      issuer: "American Heart Association",
      issueDate: "2024",
      expiryDate: "2026",
    },
  ],

  languages: [
    {
      id: "doctor-lang-001",
      name: "English",
      proficiency: "native",
    },
    {
      id: "doctor-lang-002",
      name: "French",
      proficiency: "fluent",
    },
  ],

  awards: [
    {
      id: "doctor-award-001",
      title: "Outstanding Resident Award",
      issuer: "St. Mary's Hospital",
      date: "2021",
      description:
        "Recognized for clinical excellence, teamwork, and commitment to patient care.",
    },
  ],

  publications: [
    {
      id: "doctor-pub-001",
      title: "Improving Continuity of Care After Hospital Discharge",
      publisher: "Journal of General Internal Medicine",
      date: "2023",
      url: "https://example.com/publication",
    },
  ],

  volunteer: [
    {
      id: "doctor-vol-001",
      organization: "Global Health Initiative",
      role: "Volunteer Physician",
      startDate: "2019",
      endDate: "2020",
      description:
        "Provided primary medical care and health education during community outreach programs.",
    },
  ],

  references: [
    {
      id: "doctor-ref-001",
      name: "Dr. Michael Carter",
      position: "Chief of Internal Medicine",
      company: "New York Medical Center",
      email: "michael.carter@example.com",
      relationship: "Department Chair",
    },
  ],

  interests: [
    "Global Health",
    "Medical Education",
    "Running",
    "Classical Music",
  ],

  customSections: [],
};

/* ============================================================
   RESUME 03 — CIVIL ENGINEER
   ============================================================ */

export const civilEngineerResume: ResumeData = {
  id: "resume-engineer-001",
  title: "Civil Engineer Resume",
  template: "executive",
  accentColor: "#B45309",

  personal: {
    firstName: "Daniel",
    lastName: "Richardson",
    jobTitle: "Senior Civil Engineer",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    email: "daniel.richardson@example.com",
    phone: "+1 (312) 555-0148",
    location: "Chicago, Illinois",
    website: "https://danielrichardson.example.com",
    linkedin: "https://linkedin.com/in/danielrichardson",
  },

  summary:
    "Senior Civil Engineer with 11+ years of experience leading complex infrastructure, transportation, and commercial construction projects. Expertise in structural coordination, project planning, site development, cost management, engineering documentation, and regulatory compliance. Recognized for delivering technically demanding projects safely, efficiently, and within budget.",

  experience: [
    {
      id: "engineer-exp-001",
      company: "AEC Infrastructure Group",
      position: "Senior Civil Engineer",
      location: "Chicago, IL",
      employmentType: "Full-time",
      startDate: "2020-01",
      current: true,
      achievements: [
        "Lead engineering teams across major transportation and infrastructure projects.",
        "Manage project budgets exceeding $45 million.",
        "Coordinate engineering, construction, environmental, and government stakeholders.",
        "Review technical drawings, engineering calculations, and construction documentation.",
        "Improved project delivery timelines by implementing standardized planning workflows.",
      ],
    },
    {
      id: "engineer-exp-002",
      company: "Metro Engineering Partners",
      position: "Civil Engineer",
      location: "Chicago, IL",
      employmentType: "Full-time",
      startDate: "2015-04",
      endDate: "2019-12",
      current: false,
      achievements: [
        "Designed and coordinated site development and transportation infrastructure projects.",
        "Prepared engineering reports, specifications, and technical documentation.",
        "Conducted site inspections and collaborated with contractors during construction.",
        "Supported project estimation, scheduling, and cost control activities.",
      ],
    },
  ],

  education: [
    {
      id: "engineer-edu-001",
      institution: "University of Illinois Urbana-Champaign",
      degree: "Master of Science",
      fieldOfStudy: "Civil Engineering",
      location: "Urbana, Illinois",
      startDate: "2013",
      endDate: "2015",
    },
    {
      id: "engineer-edu-002",
      institution: "Purdue University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Civil Engineering",
      location: "West Lafayette, Indiana",
      startDate: "2009",
      endDate: "2013",
    },
  ],

  skills: [
    {
      id: "eng-skill-001",
      name: "AutoCAD",
      level: "expert",
      category: "Engineering Software",
    },
    {
      id: "eng-skill-002",
      name: "Civil 3D",
      level: "advanced",
      category: "Engineering Software",
    },
    {
      id: "eng-skill-003",
      name: "Project Management",
      level: "expert",
      category: "Management",
    },
    {
      id: "eng-skill-004",
      name: "Structural Analysis",
      level: "advanced",
      category: "Engineering",
    },
    {
      id: "eng-skill-005",
      name: "Site Development",
      level: "expert",
      category: "Engineering",
    },
    {
      id: "eng-skill-006",
      name: "Construction Management",
      level: "advanced",
      category: "Management",
    },
  ],

  projects: [
    {
      id: "eng-project-001",
      name: "Downtown Transit Expansion",
      role: "Lead Civil Engineer",
      description:
        "Large-scale urban transportation infrastructure project involving station development, road improvements, drainage, and utility coordination.",
      technologies: ["AutoCAD", "Civil 3D", "ProjectWise", "BIM"],
      startDate: "2022",
      achievements: [
        "Coordinated engineering deliverables across 6 disciplines.",
        "Supported delivery of a $28 million infrastructure package.",
        "Maintained project milestones through complex construction phases.",
      ],
    },
  ],

  certifications: [
    {
      id: "eng-cert-001",
      name: "Professional Engineer (PE)",
      issuer: "State Engineering Board",
      issueDate: "2019",
      credentialId: "PE-123456",
    },
    {
      id: "eng-cert-002",
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      issueDate: "2021",
      credentialId: "PMP-123456",
    },
  ],

  languages: [
    {
      id: "eng-lang-001",
      name: "English",
      proficiency: "native",
    },
    {
      id: "eng-lang-002",
      name: "German",
      proficiency: "conversational",
    },
  ],

  awards: [
    {
      id: "eng-award-001",
      title: "Project Excellence Award",
      issuer: "AEC Infrastructure Group",
      date: "2024",
      description:
        "Recognized for outstanding technical leadership and project execution.",
    },
  ],

  publications: [],

  volunteer: [
    {
      id: "eng-vol-001",
      organization: "Engineers Without Borders",
      role: "Volunteer Engineer",
      startDate: "2018",
      current: true,
      description:
        "Support infrastructure development and engineering education initiatives in underserved communities.",
    },
  ],

  references: [],

  interests: [
    "Sustainable Infrastructure",
    "Architecture",
    "Cycling",
    "Travel",
    "Urban Development",
  ],

  customSections: [],
};

/* ============================================================
   RESUME 04 — PRODUCT DESIGNER
   ============================================================ */

export const productDesignerResume: ResumeData = {
  id: "resume-designer-001",
  title: "Senior Product Designer Resume",
  template: "creative",
  accentColor: "#7C3AED",

  personal: {
    firstName: "Emma",
    lastName: "Williams",
    jobTitle: "Senior Product Designer",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    email: "emma.williams@example.com",
    phone: "+1 (646) 555-0173",
    location: "New York, New York",
    website: "https://emmawilliams.design",
    linkedin: "https://linkedin.com/in/emmawilliams",
    portfolio: "https://emmawilliams.design",
  },

  summary:
    "Senior Product Designer with 7+ years of experience creating intuitive digital products for SaaS, fintech, and consumer technology companies. Specialized in product strategy, UX research, interaction design, design systems, prototyping, and cross-functional collaboration. Passionate about transforming complex problems into simple, elegant experiences.",

  experience: [
    {
      id: "designer-exp-001",
      company: "Nova Labs",
      position: "Senior Product Designer",
      location: "New York, NY",
      employmentType: "Full-time",
      startDate: "2021-08",
      current: true,
      achievements: [
        "Led end-to-end product design for a financial platform serving more than 500,000 customers.",
        "Built and maintained a scalable design system used by 9 product teams.",
        "Conducted user research, usability testing, and product discovery workshops.",
        "Partnered with product managers and engineers to launch 15+ major features.",
        "Improved onboarding completion by 27% through user-centered redesign.",
      ],
    },
    {
      id: "designer-exp-002",
      company: "Studio North",
      position: "Product Designer",
      location: "New York, NY",
      employmentType: "Full-time",
      startDate: "2018-06",
      endDate: "2021-07",
      current: false,
      achievements: [
        "Designed web and mobile experiences for technology startups.",
        "Created interactive prototypes and user flows for product validation.",
        "Worked closely with engineering teams throughout implementation.",
      ],
    },
  ],

  education: [
    {
      id: "designer-edu-001",
      institution: "Parsons School of Design",
      degree: "Bachelor of Fine Arts",
      fieldOfStudy: "Communication Design",
      location: "New York, NY",
      startDate: "2014",
      endDate: "2018",
    },
  ],

  skills: [
    {
      id: "designer-skill-001",
      name: "Figma",
      level: "expert",
      category: "Design Tools",
    },
    {
      id: "designer-skill-002",
      name: "UX Research",
      level: "expert",
      category: "UX",
    },
    {
      id: "designer-skill-003",
      name: "Interaction Design",
      level: "expert",
      category: "UX",
    },
    {
      id: "designer-skill-004",
      name: "Design Systems",
      level: "expert",
      category: "Systems",
    },
    {
      id: "designer-skill-005",
      name: "Prototyping",
      level: "advanced",
      category: "Design",
    },
    {
      id: "designer-skill-006",
      name: "Product Strategy",
      level: "advanced",
      category: "Strategy",
    },
  ],

  projects: [
    {
      id: "designer-project-001",
      name: "Nova Banking Experience",
      role: "Lead Product Designer",
      description:
        "Redesigned the core banking experience to simplify financial management for first-time digital banking customers.",
      technologies: ["Figma", "FigJam", "Design System", "User Research"],
      startDate: "2023",
      endDate: "2024",
      url: "https://example.com/nova",
      achievements: [
        "Increased onboarding completion by 27%.",
        "Reduced customer support requests related to account setup by 22%.",
        "Created reusable components adopted across the product ecosystem.",
      ],
    },
  ],

  certifications: [
    {
      id: "designer-cert-001",
      name: "Google UX Design Professional Certificate",
      issuer: "Google",
      issueDate: "2020",
    },
  ],

  languages: [
    {
      id: "designer-lang-001",
      name: "English",
      proficiency: "native",
    },
    {
      id: "designer-lang-002",
      name: "Italian",
      proficiency: "professional",
    },
  ],

  awards: [
    {
      id: "designer-award-001",
      title: "Awwwards Honorable Mention",
      issuer: "Awwwards",
      date: "2024",
      description:
        "Recognized for excellence in digital product experience and interface design.",
    },
  ],

  publications: [],

  volunteer: [
    {
      id: "designer-vol-001",
      organization: "Design Mentorship Network",
      role: "Design Mentor",
      startDate: "2022",
      current: true,
      description:
        "Mentor junior designers and career changers through portfolio reviews and design workshops.",
    },
  ],

  references: [],

  interests: [
    "Typography",
    "Photography",
    "Architecture",
    "Travel",
    "Creative Technology",
  ],

  customSections: [],
};

/* ============================================================
   RESUME 05 — MARKETING MANAGER
   ============================================================ */

export const marketingManagerResume: ResumeData = {
  id: "resume-marketing-001",
  title: "Marketing Manager Resume",
  template: "minimal",
  accentColor: "#DB2777",

  personal: {
    firstName: "Olivia",
    lastName: "Thompson",
    jobTitle: "Senior Marketing Manager",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    email: "olivia.thompson@example.com",
    phone: "+1 (617) 555-0162",
    location: "Boston, Massachusetts",
    website: "https://oliviathompson.example.com",
    linkedin: "https://linkedin.com/in/oliviathompson",
  },

  summary:
    "Results-driven Senior Marketing Manager with 8+ years of experience developing growth strategies, launching integrated campaigns, and building high-performing brands across technology and SaaS markets. Strong background in demand generation, content strategy, lifecycle marketing, analytics, and team leadership. Consistently delivers measurable improvements in acquisition, conversion, and customer retention.",

  experience: [
    {
      id: "marketing-exp-001",
      company: "CloudPeak",
      position: "Senior Marketing Manager",
      location: "Boston, MA",
      employmentType: "Full-time",
      startDate: "2021-02",
      current: true,
      achievements: [
        "Led global demand-generation strategy across North America and Europe.",
        "Increased qualified pipeline by 74% year over year.",
        "Managed annual marketing budget exceeding $3 million.",
        "Built integrated campaigns across paid media, content, email, SEO, and events.",
        "Led a team of 8 marketers across multiple disciplines.",
      ],
    },
    {
      id: "marketing-exp-002",
      company: "GrowthWorks",
      position: "Marketing Manager",
      location: "Boston, MA",
      employmentType: "Full-time",
      startDate: "2018-01",
      endDate: "2021-01",
      current: false,
      achievements: [
        "Developed content and lifecycle marketing programs for B2B SaaS customers.",
        "Improved email conversion rates by 38%.",
        "Launched SEO strategy that increased organic traffic by 120%.",
        "Managed product launches across digital and offline channels.",
      ],
    },
  ],

  education: [
    {
      id: "marketing-edu-001",
      institution: "Boston University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Marketing",
      location: "Boston, Massachusetts",
      startDate: "2010",
      endDate: "2014",
    },
  ],

  skills: [
    {
      id: "marketing-skill-001",
      name: "Growth Marketing",
      level: "expert",
      category: "Marketing",
    },
    {
      id: "marketing-skill-002",
      name: "SEO",
      level: "expert",
      category: "Digital Marketing",
    },
    {
      id: "marketing-skill-003",
      name: "Content Strategy",
      level: "expert",
      category: "Content",
    },
    {
      id: "marketing-skill-004",
      name: "Google Analytics",
      level: "advanced",
      category: "Analytics",
    },
    {
      id: "marketing-skill-005",
      name: "Email Marketing",
      level: "expert",
      category: "Lifecycle",
    },
    {
      id: "marketing-skill-006",
      name: "Team Leadership",
      level: "advanced",
      category: "Leadership",
    },
  ],

  projects: [
    {
      id: "marketing-project-001",
      name: "Global Product Launch",
      role: "Marketing Lead",
      description:
        "Developed and executed an integrated global marketing campaign for a new SaaS product launch.",
      technologies: [
        "HubSpot",
        "Google Analytics",
        "Google Ads",
        "SEO",
        "Content Marketing",
      ],
      startDate: "2024",
      achievements: [
        "Generated more than 12,000 qualified leads.",
        "Exceeded launch pipeline target by 46%.",
        "Coordinated campaigns across five international markets.",
      ],
    },
  ],

  certifications: [
    {
      id: "marketing-cert-001",
      name: "Google Analytics Certification",
      issuer: "Google",
      issueDate: "2024",
    },
    {
      id: "marketing-cert-002",
      name: "HubSpot Content Marketing Certification",
      issuer: "HubSpot",
      issueDate: "2023",
    },
  ],

  languages: [
    {
      id: "marketing-lang-001",
      name: "English",
      proficiency: "native",
    },
    {
      id: "marketing-lang-002",
      name: "Portuguese",
      proficiency: "fluent",
    },
  ],

  awards: [
    {
      id: "marketing-award-001",
      title: "Marketing Campaign of the Year",
      issuer: "CloudPeak",
      date: "2024",
      description:
        "Recognized for delivering the company's highest-performing product launch campaign.",
    },
  ],

  publications: [
    {
      id: "marketing-pub-001",
      title: "The Future of B2B Growth Marketing",
      publisher: "Growth Marketing Review",
      date: "2024",
      url: "https://example.com/growth-marketing",
    },
  ],

  volunteer: [],

  references: [],

  interests: [
    "Brand Strategy",
    "Travel",
    "Writing",
    "Behavioral Psychology",
    "Photography",
  ],

  customSections: [],
};

/* ============================================================
   ALL DEMO RESUMES
   ============================================================ */

export const demoResumes: ResumeData[] = [
  seniorSoftwareEngineerResume,
  medicalDoctorResume,
  civilEngineerResume,
  productDesignerResume,
  marketingManagerResume,
];

/* ============================================================
   DEFAULT EMPTY RESUME
   ============================================================ */

export const emptyResume: ResumeData = {
  id: "new-resume",
  title: "My Resume",
  template: "modern",
  accentColor: "#2563EB",

  personal: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    photo: "",
    email: "",
    phone: "",
    location: "",
    address: "",
    website: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },

  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
  volunteer: [],
  references: [],
  interests: [],
  customSections: [],
};
