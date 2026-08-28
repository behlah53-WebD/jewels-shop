import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo">
      <span>A</span>
      <b>
        Aurelia <i>Jewels</i>
      </b>
    </Link>
  );
}
