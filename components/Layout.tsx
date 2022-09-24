import { useRouter } from "next/router";
import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  if (router.pathname === "/login" || router.pathname === "/welcome") {
    return <main>{children}</main>;
  }
  return (
    <div
      className={[
        "h-screen bg-[#27236B]",
        "grid grid-rows-[max-content_1fr]",
        "grid-cols-1 md:grid-cols-[max-content_1fr]",
      ].join(" ")}
    >
      <Navbar className='row-span-1 col-span-2' />
      <Sidebar
        className={["row-start-2 col-start-1", "hidden md:block"].join(" ")}
      />
      <main
        className={[
          "md:col-start-2 col-span-1 row-start-2 row-span-1",
          " h-full overflow-y-scroll",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
