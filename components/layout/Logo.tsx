import Image from "next/image";
import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="PingMe home">
      {/* <span className="logoMark" aria-hidden="true">
        <span />
      </span> */}
      <Image src="/icon.svg" alt="" width={32} height={32} aria-hidden="true" />
      {!compact && <span>PingMe</span>}
    </Link>
  );
}
