import {
  Calculator,
  BookText,
  Globe,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

export const sundaySessions = {
  day: "Every Sunday",
  time: "5 PM to 9 PM",
  subjects: ["Maths", "Reasoning", "English", "GS"],
  description:
    "Bring your doubts in Maths, Reasoning, English and GS, plus general guidance on competitive exams.",
} as const;

export const sessionSubjects: { label: string; icon: LucideIcon }[] = [
  { label: "Maths", icon: Calculator },
  { label: "Reasoning", icon: Puzzle },
  { label: "English", icon: BookText },
  { label: "GS", icon: Globe },
];
