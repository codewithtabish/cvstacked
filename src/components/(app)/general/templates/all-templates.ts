import TemplateFive from "./template-five";
import TemplateFour from "./template-four";
import TemplateOne from "./template-one";
import TemplateSeven from "./template-seven";
import TemplateSix from "./template-six";
import TemplateThree from "./template-three";
import TemplateTwo from "./template-two";

export type ResumeTemplatePlan = "free" | "premium";

export const RESUME_TEMPLATES = [
  {
    id: "tpl_7f3k9x2m",
    name: "Aurelia",
    description: "A refined modern resume with clean typography and balanced spacing.",
    category: "modern",
    plan: "free",
    number: 1,
    component: TemplateOne,
    thumbnail: "/images/templates/ones.webp",
  },

  {
    id: "tpl_4p8n2q6v",
    name: "Sterling",
    description: "A polished professional resume with a structured two-column layout.",
    category: "professional",
    plan: "premium",
    number: 2,
    component: TemplateTwo,
    thumbnail: "/images/templates/twos.webp",
  },

  {
    id: "tpl_9a5m7c1r",
    name: "Nova",
    description: "A contemporary resume with a clean layout and strong visual hierarchy.",
    category: "modern",
    plan: "premium",
    number: 3,
    component: TemplateThree,
    thumbnail: "/images/templates/threes.webp",
  },

  {
    id: "tpl_2k8d5w1p",
    name: "Monarch",
    description: "A timeless classic resume with an elegant and structured presentation.",
    category: "classic",
    plan: "free",
    number: 4,
    component: TemplateFour,
    thumbnail: "/images/templates/fours.webp",
  },

  {
    id: "tpl_2k8d5whks",
    name: "Celeste",
    description: "An elegant resume with sophisticated typography and a graceful layout.",
    category: "elegant",
    plan: "premium",
    number: 5,
    component: TemplateFive,
    thumbnail: "/images/templates/fives.webp",
  },

  {
    id: "tpl_2k8d5whxes",
    name: "Vertex",
    description: "A technical resume built for clarity, precision, and structured content.",
    category: "technical",
    plan: "premium",
    number: 6,
    component: TemplateSix,
    thumbnail: "/images/templates/six.webp",
  },

  {
    id: "tpl_6m3q8v1z",
    name: "Vantage",
    description: "A compact resume designed for maximum clarity in a space-efficient layout.",
    category: "compact",
    plan: "free",
    number: 7,
    component: TemplateSeven,
    thumbnail: "/images/templates/one.webp",
  },
] as const;
