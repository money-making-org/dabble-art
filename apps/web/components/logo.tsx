import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" prefetch className="flex items-center gap-0">
      <Image
        src="/logotest2.png"
        alt="dabble.art logo"
        width={64}
        height={64}
        className="object-contain"
        priority
      />
      <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-[#009FFF] via-[#007FFF] to-[#38bdf8] bg-clip-text text-transparent -ml-2">
        dabble
      </span>
    </Link>
  );
}
