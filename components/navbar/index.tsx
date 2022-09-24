import { useSession } from "next-auth/react";
import Image from "next/image";
import { Menu } from "../icons";

const Navbar = ({ className }: { className: string }) => {
  const { status, data } = useSession();
  return (
    <nav className={["px-2 md:px-5 pt-3", `${className}`].join(" ")}>
      <div
        className={[" px-5 bg-[#1b184b] md:px-8 py-4", "rounded-sm"].join(" ")}
      >
        <div className='flex justify-between items-center'>
          <Menu width={32} height={32} className='fill-slate-800 md:hidden' />
          <span className='text-slate-100'>Learning App</span>
          <div className='flex'>
            <Image
              src={data?.user?.image as string}
              width={38}
              height={38}
              className='rounded-full'
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
