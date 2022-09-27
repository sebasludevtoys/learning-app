import { signIn, useSession } from "next-auth/react";

import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

const Page = () => {
  return (
    <div
      className={[
        "bg-[#100DD7]",
        " h-screen",
        "flex flex-col md:flex-row",
      ].join(" ")}
    >
      <div
        className={[
          "bg-[#180907] bg-opacity-70",
          "md:w-[30vw]",
          "flex items-center justify-center",
          "py-16 md:py-0",
        ].join(" ")}
      >
        <h1 className='text-slate-50 font-bold text-5xl'>Login</h1>
      </div>
      <div className='flex justify-center h-full md:w-[70vw] md:items-center'>
        <div className='flex flex-col gap-y-8 pt-20 md:pt-0'>
          <button
            className='bg-slate-50 px-6 py-2 font-bold text-lg rounded-sm'
            onClick={() =>
              signIn("github", { callbackUrl: "http://localhost:3000" })
            }
          >
            Github
          </button>
          <button className='bg-slate-50 px-6 py-2 font-bold text-lg rounded-sm'>
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

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

Page.authPage = true;
