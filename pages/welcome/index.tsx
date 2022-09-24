import Link from "next/link";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default function Page() {
  return (
    <div className='grid h-screen bg-[#100DD7]'>
      <div className='flex flex-col md:flex-row z-10 col-span-1 row-span-1'>
        <div
          className={[
            "bg-[#180907] bg-opacity-70",
            "w-full md:w-[57vw]",
            "px-10 md:pl-20 md:pr-28",
            "md:pt-[20%] py-16",
          ].join(" ")}
        >
          <div className=' flex flex-col gap-y-5'>
            <h1 className='text-slate-50 font-bold text-5xl'>
              Welcome to Learning App
            </h1>
            <p className='text-slate-300'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              alias facilis quam quae sapiente natus minima reprehenderit! Velit
              ipsum consequatur dicta magni enim sapiente! Sint ea a quas
              exercitationem tempora illum maxime quis nostrum dignissimos iste,
              dolorem facilis iusto perferendis!
            </p>
          </div>
        </div>
        <div
          className={[
            "md:w-[43vw]",
            "flex justify-center items-center text-center",
            "h-full",
          ].join(" ")}
        >
          <div className='flex flex-col gap-y-10'>
            <Link href='/login'>
              <a className='bg-slate-100 px-8 font-semibold rounded-sm py-2 inline-block'>
                Login
              </a>
            </Link>
            <Link href='/login'>
              <a className='bg-slate-100 px-8 font-semibold rounded-sm py-2 inline-block'>
                Register
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
