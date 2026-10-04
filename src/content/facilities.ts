import {
  BookOpen,
  Clock3,
  Droplets,
  LampDesk,
  ShieldCheck,
  Snowflake,
  Volume1,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type Facility = {
  title: string;
  text: string;
  icon: LucideIcon;
  tone: "navy" | "gold" | "red" | "light";
  className?: string;
};

export const facilities: Facility[] = [
  {
    title: "Personal numbered cabins",
    text: "Your own desk with a lamp and a power point. Pick a cabin and make it yours for the month.",
    icon: LampDesk,
    tone: "navy",
    className: "sm:col-span-2 lg:row-span-2",
  },
  {
    title: "Fully air-conditioned",
    text: "Stay comfortable through Jammu's summers and winters.",
    icon: Snowflake,
    tone: "light",
  },
  {
    title: "High-speed Wi-Fi",
    text: "Fast and stable for mock tests, videos and research.",
    icon: Wifi,
    tone: "light",
  },
  {
    title: "A silent, distraction-free hall",
    text: "A quiet environment where everyone around you is studying too.",
    icon: Volume1,
    tone: "red",
    className: "sm:col-span-2",
  },
  {
    title: "Open 24 hours",
    text: "Early mornings or late nights, your seat is ready.",
    icon: Clock3,
    tone: "gold",
    className: "lg:col-span-2",
  },
  {
    title: "CCTV surveillance",
    text: "Your safety and belongings stay protected.",
    icon: ShieldCheck,
    tone: "light",
    className: "lg:col-span-2",
  },
  //   {
  //     title: "RO water and refreshment zone",
  //     text: "Take a short break without leaving the building.",
  //     icon: Droplets,
  //     tone: "light",
  //   },
  //   {
  //     title: "Books and study resources",
  //     text: "A wide range of books and material on the shelves.",
  //     icon: BookOpen,
  //     tone: "light",
  //   },
];
