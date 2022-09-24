import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import styles from "./Btn.module.css";

const Btn = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  const router = useRouter();
  return (
    <div
      className={[
        "grid grid-cols-[6px_1fr_6px] grid-rows-[6px_max-content_6px]",
        `${href === router.pathname ? "opacity-100" : "opacity-50"}`,
      ].join(" ")}
    >
      <div className='bg-red-400 col-start-1 col-span-2 row-start-2 row-span-2 rounded-sm' />
      <Link href={href}>
        <a
          className={[
            "col-start-2 col-span-2 row-start-1 row-span-2",
            "px-5 py-2",
            "block",
            "rounded-sm",
            "text-lg font-semibold",
            "bg-slate-100",
          ].join(" ")}
        >
          {children}
        </a>
      </Link>
    </div>
  );
};

export default Btn;
