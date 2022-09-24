import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/prisma";
import { Certificate, Exercise, Course } from "@prisma/client";
import { create } from "../../lib/db";

type CleanCertificate = Omit<
  Certificate,
  "short_description" | "started_certificateId" | "completed_certificateId"
>;

type CleanExercise = Omit<
  Exercise,
  "certificateId" | "started_exerciseId" | "completed_exerciseId"
> & {
  _count: {
    tasks: number;
  };
};

type CleanCourse = Omit<
  Course,
  "completed_courseId" | "started_courseId" | "certificateId " | "certificateId"
>;

type Props = CleanCertificate &
  CleanExercise[] & {
    course: {
      fundamentals: CleanCourse[];
      inter: CleanCourse[];
      advanced: CleanCourse[];
    };
  };

const Page = ({
  certificateData,
  status,
  userEnrolled,
}: {
  certificateData: Props;
  status: any;
  userEnrolled: any;
}) => {
  const handleAction = async (id: number) => {
    await create("POST", "certificate", { id });
  };

  return (
    <div>
      <div>
        <h1>{certificateData.title}</h1>
        <p>{certificateData.long_description}</p>
        <span>{certificateData.type}</span>
      </div>
      <div>
        <h2>courses</h2>
        <div className={["bg-yellow-500"].join(" ")}>
          <h3>fundamentals</h3>
          {certificateData.course.fundamentals.map((course) => (
            <div key={course.id}>
              <div>{course.title}</div>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h3>inter</h3>
          {certificateData.course.inter.map((course) => (
            <div key={course.id}>{course.title}</div>
          ))}
        </div>
        <div>
          <h3>advanced</h3>
          {certificateData.course.advanced.map((course) => (
            <div key={course.id}>{course.title}</div>
          ))}
        </div>
      </div>
      <div>
        {status === "not started" ? (
          <button
            className='bg-red-600'
            onClick={() => handleAction(certificateData.id)}
          >
            Enroll
          </button>
        ) : (
          <span>
            {status === "started"
              ? "Enrolled"
              : status === "completed" && "Completed"}
          </span>
        )}
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
    const certificateData = await prisma.certificate.findUnique({
      where: {
        id: +context.params.id,
      },
      select: {
        id: true,
        title: true,
        long_description: true,
        type: true,
        course: {
          select: {
            title: true,
            description: true,
            id: true,
            module: true,
          },
        },
        exercise: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    const userEnrolled = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        started_certificates: {
          select: {
            certificates: {
              where: {
                id: +context.params.id,
              },
            },
          },
        },
        completed_certificates: {
          select: {
            certificates: {
              where: {
                id: +context.params.id,
              },
            },
          },
        },
      },
    });

    let cleanData: any = {
      completed_certificates: [],
      started_certificates: [],
    };

    userEnrolled?.completed_certificates.forEach((cert) => {
      cert.certificates.map((ct) =>
        cleanData.completed_certificates.push({ id: ct.id })
      );
    });
    userEnrolled?.started_certificates.forEach((cert) => {
      cert.certificates.map((ct) =>
        cleanData.started_certificates.push({ id: ct.id })
      );
    });

    const started = cleanData?.started_certificates.findIndex(
      (crt: any) => crt.id === +context.params.id
    );
    const completed = cleanData?.completed_certificates.findIndex(
      (crt: any) => crt.id === +context.params.id
    );

    let status;
    if (started === 0 && completed === -1) status = "started";
    else if (completed === 0 && started === -1) status = "completed";
    else status = "not started";

    const fundamentals: any = [];
    const inter: any = [];
    const advanced: any = [];

    certificateData?.course.map((course) => {
      if (course.module === "fundametals") fundamentals.push(course);
      if (course.module === "advanced") advanced.push(course);
      else inter.push(course);
    });

    return {
      props: {
        certificateData: {
          ...certificateData,
          course: {
            fundamentals,
            inter,
            advanced,
          },
        },
        status,
        userEnrolled,
      },
    };
  }
}
