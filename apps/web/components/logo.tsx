import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" prefetch className="flex items-center gap-0">
      <Image
        src="/logotest2.png"
        alt="dabble.art logo"
        width={48}
        height={48}
        className="object-contain"
        priority
      />
      <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 bg-clip-text text-transparent -ml-1">
        dabble
      </span>
    </Link>
  );
}
