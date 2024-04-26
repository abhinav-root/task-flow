import Link from "next/link";

export default function Logo() {
  return (
    <span className="uppercase text-blue-500 text-xl font-black">
      <Link href="/">
        task flow
      </Link>
    </span>
  );
}
