import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { Certificate } from "@prisma/client";
import prisma from "../../lib/prisma";
import Link from "next/link";
import { useState } from "react";

type props = Certificate & {
  _count: {
    exercise: number;
    course: number;
  };
};

const Page = ({ certificatesData }: { certificatesData: props[] }) => {
  const [filter, setFilter] = useState("all");
  return (
    <div>
      <div className='flex gap-x-3'>
        <button className='bg-red-400' onClick={() => setFilter("short")}>
          Short
        </button>
        <button className='bg-red-400' onClick={() => setFilter("full")}>
          Full
        </button>
        <button className='bg-red-400' onClick={() => setFilter("all")}>
          All
        </button>
      </div>
      <div className='grid grid-cols-2 gap-10'>
        {filter === "all" ? (
          <>
            {certificatesData.map((certificate) => (
              <Link
                key={certificate.id}
                href={`certificates/${certificate.id}`}
              >
                <a
                  className={[
                    " px-4 py-5",
                    "bg-yellow-600",
                    `${certificate.completed_certificateId && "bg-yellow-900"}`,
                  ].join(" ")}
                >
                  <div>
                    <span>
                      {certificate.type === "short"
                        ? "Short Certificate"
                        : "Full Certificate"}
                    </span>
                    <h3>{certificate.title}</h3>
                    <div className='flex'>
                      <div>
                        <span>{certificate._count.course}</span>
                        <span>Courses</span>
                      </div>
                      <div>
                        <span>{certificate._count.exercise}</span>
                        <span>Exercises</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>{certificate.short_description}</p>
                  </div>
                  <div>
                    <span>
                      {certificate.completed_certificateId
                        ? "COMPLETED"
                        : certificate.started_certificateId && "Continue"}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </>
        ) : (
          <>
            {certificatesData
              .filter(
                (certificate) => certificate.type.toLowerCase() === filter
              )
              .map((certificate) => (
                <Link
                  key={certificate.id}
                  href={`certificates/${certificate.id}`}
                >
                  <a
                    className={[
                      " px-4 py-5",
                      "bg-yellow-600",
                      `${
                        certificate.completed_certificateId && "bg-yellow-900"
                      }`,
                    ].join(" ")}
                  >
                    <div>
                      <span>
                        {certificate.type === "short"
                          ? "Short Certificate"
                          : "Full Certificate"}
                      </span>
                      <h3>{certificate.title}</h3>
                      <div className='flex'>
                        <div>
                          <span>{certificate._count.course}</span>
                          <span>Courses</span>
                        </div>
                        <div>
                          <span>{certificate._count.exercise}</span>
                          <span>Exercises</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p>{certificate.short_description}</p>
                    </div>
                    <div>
                      <span>
                        {certificate.completed_certificateId
                          ? "COMPLETED"
                          : certificate.started_certificateId && "Continue"}
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
          </>
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
    const certificatesData = await prisma.certificate.findMany({
      select: {
        title: true,
        type: true,
        short_description: true,
        long_description: true,
        completed_certificateId: true,
        started_certificateId: true,
        id: true,
        _count: {
          select: {
            course: true,
            exercise: true,
          },
        },
      },
    });

    //TODO: change completed and started certificates
    return {
      props: {
        certificatesData,
      },
    };
  }
}
