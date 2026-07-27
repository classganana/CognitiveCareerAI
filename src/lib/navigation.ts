import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Mentees",
    href: "/mentees",
    icon: Users,
  },
  {
    title: "Knowledge Repository",
    href: "/knowledge-repository",
    icon: BookOpen,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
