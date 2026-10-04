"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Inbox, Settings, Sparkles } from "lucide-react";

const links = [
  { href: "/day", label: "Today", Icon: CalendarDays },
  { href: "/inbox", label: "Inbox", Icon: Inbox },
  { href: "/#brain-dump", label: "Brain Dump", Icon: Sparkles, primary: true },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function MobileNavigation() {
  const pathname = usePathname();
  return <nav className="mobileNav" aria-label="Mobile navigation">
    {links.map(({ href, label, Icon, primary }) => <Link href={href} key={href} className={`${pathname === href ? "active" : ""} ${primary ? "capture" : ""}`}>
      <span><Icon size={primary ? 22 : 20} /></span><small>{label}</small>
    </Link>)}
  </nav>;
}
