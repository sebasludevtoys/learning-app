import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "../lib/prisma";
import { useState } from "react";

type Certificate = {
  title: string;
  id: number;
};

type UserData = {
  started_certificates: Certificate[];
  completed_certificates: Certificate[];
  started_exercises: Certificate[];
  completed_exercises: Certificate[];
};

const Home = ({ userData }: { userData: UserData }) => {
  const { status, data } = useSession();
  const [category, setCategory] = useState("started");

  return (
    <div className='h-[3000px]'>
      <div className='flex gap-x-5'>
        <button className='bg-red-400' onClick={() => setCategory("completed")}>
          Completed
        </button>
        <button className='bg-red-400' onClick={() => setCategory("started")}>
          Started
        </button>
      </div>
      <div>
        <h2 className='text-slate-50'>{category} Certificates</h2>
        {category === "started" ? (
          <div>
            {userData.started_certificates.length === 0 ? (
              <span>not started certificates</span>
            ) : (
              <div>
                {userData.started_certificates.map((cert) => (
                  <h2 key={cert.id} className='bg-yellow-300'>
                    {cert.title}
                  </h2>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {userData.completed_certificates.length === 0 ? (
              <span>not completed certificates</span>
            ) : (
              <div>
                {userData.completed_certificates.map((cert) => (
                  <h2 key={cert.id} className='bg-yellow-300'>
                    {cert.title}
                  </h2>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <h2 className='text-slate-50'>{category} Exercises</h2>
        {category === "started" ? (
          <div>
            {userData.started_exercises.length === 0 ? (
              <span>not started Exercises</span>
            ) : (
              <div>
                {userData.started_exercises.map((exercise) => (
                  <h3 key={exercise.id}>{exercise.title}</h3>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {userData.completed_exercises.map((exercise) => (
              <h3 key={exercise.id}>{exercise.title}</h3>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    const userData = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
      select: {
        started_certificates: {
          select: {
            certificates: {
              select: {
                title: true,
                id: true,
              },
            },
          },
        },
        completed_certificates: {
          select: {
            certificates: {
              select: {
                title: true,
                id: true,
              },
            },
          },
        },
        started_exercises: {
          select: {
            exercises: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        completed_exercises: {
          select: {
            exercises: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    let cleanCompletedCerts: any = [];
    let cleanCompletedExercises: any = [];
    let cleanStartedCerts: any = [];
    let cleanStartedExercises: any = [];

    userData?.completed_certificates.forEach((completedCertificate) =>
      completedCertificate.certificates.map((cert) =>
        cleanCompletedCerts.push(cert)
      )
    );
    userData?.started_certificates.forEach((startedCertificate) =>
      startedCertificate.certificates.map((cert) =>
        cleanStartedCerts.push(cert)
      )
    );

    userData?.started_exercises.map((startedExercise) =>
      startedExercise.exercises.map((exercise) =>
        cleanStartedExercises.push(exercise)
      )
    );

    userData?.completed_exercises.map((completedExercise) =>
      completedExercise.exercises.map((exercise) =>
        cleanCompletedExercises.push(exercise)
      )
    );

    return {
      props: {
        userData: {
          ...userData,
          completed_certificates: cleanCompletedCerts,
          started_certificates: cleanStartedCerts,
          started_exercises: cleanStartedExercises,
          completed_exercises: cleanCompletedExercises,
        },
      },
    };
  }
}

{
  /* <div>
<button onClick={() => setCategory("completed")}>completed</button>
<button onClick={() => setCategory("started")}>started</button>
<div>
  <h1 className='text-slate-200 text-lg'>
    {status === "loading" ? "Loading" : `${data?.user?.email}`}
  </h1>
  <button onClick={() => signOut()}>signout</button>
</div>
{category === "started" ? (
  <div className='started'>
    <div>
      <h2>Ongoing Certificates</h2>
      <p>
        {userData.started_certificates.length !== 0 ? (
          <div>
            {userData.started_certificates.map((cert) => (
              <h2 key={cert.id}>{cert.title}</h2>
            ))}
          </div>
        ) : (
          "NO Started certificates"
        )}
      </p>
    </div>
    <div>
      <h2>Ongoing Exercises</h2>
      <p>
        {userData.started_exercises.length !== 0
          ? "Certificates"
          : "NO Started Exercises"}
      </p>
    </div>
  </div>
) : (
  <div className='completed'>
    <div>
      <h2>completed Certificates</h2>
      <p>
        {userData.completed_certificates.length !== 0 ? (
          <div>
            {userData.completed_certificates.map((cert) => (
              <h2 key={cert.id}>{cert.title}</h2>
            ))}
          </div>
        ) : (
          "NO Completed certificates"
        )}
      </p>
    </div>
    <div>
      <h2>completed Exercises</h2>
      <p>
        {userData.completed_exercises.length !== 0
          ? "Certificates"
          : "NO Completed Exercises"}
      </p>
    </div>
  </div>
)}
</div> */
}
