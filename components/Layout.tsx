import { useRouter } from "next/router";
import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div
      className={[
        "h-screen grid md:grid-cols-[max-content_1fr]",
        "bg-[#2B3664]",
      ].join(" ")}
    >
      <Navbar className=' px-3 py-3 md:px-0 md:py-0 md:col-span-1' />
      <main className={["h-full overflow-y-scroll md:col-span-1"].join(" ")}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
