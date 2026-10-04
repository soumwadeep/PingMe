import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="logo" aria-label="PingMe home">
    <span className="logoMark" aria-hidden="true"><span /></span>
    {!compact && <span>PingMe</span>}
  </Link>;
}
