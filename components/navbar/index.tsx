import { Session } from "next-auth";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, EventHandler, SetStateAction, useState } from "react";
import { Apps, ArrowDown, Books, Home, Login, Menu, Puzzle } from "../icons";

const Navbar = ({ className }: { className: string }) => {
  const { status, data } = useSession();
  const [toogleNav, setTogleNav] = useState(false);
  return (
    <nav className={["relative", `${className}`].join(" ")}>
      <div
        className={[
          "h-full px-5 bg-[#212D59] md:px-8 py-4 md:hidden",
          "rounded-full",
        ].join(" ")}
      >
        <div className='flex justify-between items-center'>
          <Menu
            width={32}
            height={32}
            className='fill-slate-100 md:hidden'
            onClick={() => setTogleNav(true)}
          />
          <div className='flex md:flex-col flex-row'>
            {status === "authenticated" ? (
              <User data={data} />
            ) : (
              <LoginButton />
            )}

            {/* <button onClick={() => signOut()}>Logout</button> */}
          </div>
        </div>
      </div>
      <div
        className={[
          "h-screen md:h-full",
          `${toogleNav ? "block" : "hidden"}`,
          "block",
          "md:block",
          "md:pl-3 md:py-5",
          "absolute md:relative",
          "top-0 left-0",
          "grid grid-cols-1 grid-rows-[max-content_1fr]",
        ].join(" ")}
      >
        <div className='md:hidden row-start-1 row-end-2 col-span-full z-10 bg-slate-300 py-5 flex justify-center items-center'>
          <button className='text-3xl' onClick={() => setTogleNav(false)}>
            X
          </button>
        </div>
        <NavItems onClick={() => setTogleNav(false)} />
      </div>
    </nav>
  );
};

export default Navbar;

const pages = [
  { href: "/", name: "Home", icon: <Home /> },
  { href: "/certificates", name: "Certificates", icon: <Books /> },
  { href: "/exercises", name: "Exercises", icon: <Puzzle /> },
  { href: "/tools", name: "Tools", icon: <Apps /> },
];

const NavItems = ({
  onClick,
}: {
  onClick: Dispatch<SetStateAction<boolean>>;
}) => {
  const { status, data } = useSession();
  return (
    <div
      className={[
        "bg-[#212D59]",
        "h-full",
        "px-8 md:px-2",
        "row-start-2 row-span-1 md:row-span-full col-span-full z-0",
        "py-10",
        "md:rounded-full",
        "flex flex-col justify-between items-center",
      ].join(" ")}
    >
      <div className='flex flex-col gap-y-8'>
        {pages.map((page) => (
          <Link href={page.href}>
            <a
              className='flex flex-col items-center gap-y-1'
              onClick={() => onClick(false)}
            >
              <div className='fill-slate-50 h-[24px] w-[24px]'>{page.icon}</div>
              <span className='text-slate-50 text-sm'>{page.name}</span>
            </a>
          </Link>
        ))}
      </div>
      <div className='hidden md:block'>
        {status === "authenticated" ? <User data={data} /> : <LoginButton />}
      </div>
    </div>
  );
};

const User = ({ data }: { data: Session }) => {
  const [toogleButton, setToogleButton] = useState(false);
  const handleSignout = () => {
    signOut();
    setToogleButton(false);
  };
  return (
    <div className='relative'>
      <button
        className='flex items-center gap-x-1'
        onClick={() => setToogleButton(!toogleButton)}
      >
        <Image
          src={data?.user?.image as string}
          width={38}
          height={38}
          className='rounded-full'
        />
        <ArrowDown height={24} width={24} className='fill-slate-50 md:hidden' />
      </button>
      <div
        className={[
          "bg-red-100",
          "py-5 px-5",
          `${
            toogleButton === false
              ? "hidden"
              : "absolute top-[150%] md:top-[-25%] right-1/4 md:right-auto md:left-[150%]"
          }`,
        ].join(" ")}
      >
        <button onClick={handleSignout}>SignOut</button>
      </div>
    </div>
  );
};

const LoginButton = () => {
  return (
    <div className='flex flex-col items-center'>
      <Login className='hidden md:block stroke-slate-50' />
      <button
        onClick={() =>
          signIn("github", { callbackUrl: "http://localhost:3000" })
        }
        className='text-slate-50'
      >
        Login
      </button>
    </div>
  );
};
