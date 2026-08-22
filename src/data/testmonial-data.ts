export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  /** Path or URL to an avatar image. Falls back to initials if omitted. */
  avatarUrl?: string;
  /** 0–5, halves allowed (e.g. 4.5) */
  rating: number;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "bruce-wayne",
    name: "Bruce Wayne",
    role: "CEO & Co-Founder",
    company: "Wayne Enterprises",
    avatarUrl: "/avatars/bruce-wayne.png",
    rating: 4.5,
    quote:
      "Exceptional quality—innovative, dependable, and surpassed all expectations. The team provided excellent guidance and ensured everything worked perfectly.",
  },
  {
    id: "diana-prince",
    name: "Diana Prince",
    role: "Head of Product",
    company: "Themyscira Labs",
    avatarUrl: "/avatars/diana-prince.png",
    rating: 5,
    quote:
      "From kickoff to launch, communication was crystal clear. Every milestone landed on time and the final product felt genuinely considered, not just shipped.",
  },
  {
    id: "tony-stark",
    name: "Tony Stark",
    role: "Founder",
    company: "Stark Industries",
    avatarUrl: "/avatars/tony-stark.png",
    rating: 4,
    quote:
      "They pushed back on our first idea and the second one was better for it. That kind of honest, opinionated partnership is rare and worth paying for.",
  },
  {
    id: "natasha-romanoff",
    name: "Natasha Romanoff",
    role: "Director of Design",
    company: "Shield Digital",
    avatarUrl: "/avatars/natasha-romanoff.png",
    rating: 4.5,
    quote:
      "Meticulous attention to detail across every screen size. Our conversion numbers moved within the first week of launch and kept climbing.",
  },
];

export const testimonialStats = {
  happyClients: "100+",
  happyClientsLabel: "Happy Client",
  revenueAdded: "$250m",
  revenueAddedLabel: "Revenue Added",
  averageRating: 4.8,
  averageRatingLabel: "Average Rating",
};
