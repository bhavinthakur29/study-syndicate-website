import {
  ClipboardCheck,
  Compass,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";

export type FreeExtra = { title: string; text: string; icon: LucideIcon };

export const freeExtras: FreeExtra[] = [
  {
    title: "Mock tests",
    text: "Conducted and checked by us in Maths, Reasoning, English and GS.",
    icon: ClipboardCheck,
  },
  {
    title: "Study notes",
    text: "Notes to support your preparation, included with your seat.",
    icon: NotebookPen,
  },
  {
    title: "Career counselling",
    text: "Guidance on your exam strategy and career choices.",
    icon: Compass,
  },
];
