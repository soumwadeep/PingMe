"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import { Sparkles } from "lucide-react";
import Logo from "./Logo";

const links = [
  { href: "/day", label: "Today" },
  { href: "/inbox", label: "Inbox" },
  { href: "/settings", label: "Settings" },
];

export default function AppHeader() {
  const pathname = usePathname();
  return (
    <header className="appHeader">
      <div className="headerInner">
        <Logo />
        <nav className="desktopNav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              className={pathname === link.href ? "active" : ""}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button
          component={Link}
          href="/#brain-dump"
          variant="contained"
          startIcon={<Sparkles size={17} />}
          className="headerCta"
        >
          Brain Dump
        </Button>
      </div>
    </header>
  );
}
