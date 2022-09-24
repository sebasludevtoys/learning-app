import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/prisma";
import { Exercise } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { create } from "../../lib/db";

type ExerciseData = Exercise & {
  _count: {
    tasks: number;
  };
  status: "started" | "not started" | "completed";
};

const Page = ({ exercisesData }: { exercisesData: ExerciseData[] }) => {
  const [filter, setFilter] = useState("all");
  const handleAction = async (id: number) => {
    await create("POST", "exercise", { id });
  };
  return (
    <div>
      <div className='flex gap-x-3'>
        <button className='bg-red-400' onClick={() => setFilter("begginer")}>
          Begginer
        </button>
        <button
          className='bg-red-400'
          onClick={() => setFilter("intermediate")}
        >
          intermediate
        </button>
        <button className='bg-red-400' onClick={() => setFilter("advanced")}>
          Advanced
        </button>
        <button className='bg-red-400' onClick={() => setFilter("all")}>
          All
        </button>
      </div>
      <div className='grid grid-cols-2 gap-10'>
        {filter === "all" ? (
          <>
            {exercisesData.map((exercise) => (
              <div className='bg-yellow-600 px-4 py-5'>
                <div>
                  <span>{exercise.difficulty}</span>
                  <h3>{exercise.title}</h3>
                  <div className='flex'>
                    <div>
                      <span>{exercise._count.tasks}</span>
                      <span>Tasks</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p>{exercise.description}</p>
                </div>
                <div>status:{exercise.status}</div>
                {exercise.status === "not started" ? (
                  <Link key={exercise.id} href={`exercises/${exercise.id}`}>
                    <a
                      className='bg-red-600'
                      onClick={() => handleAction(exercise.id)}
                    >
                      start
                    </a>
                  </Link>
                ) : (
                  <Link key={exercise.id} href={`exercises/${exercise.id}`}>
                    <a className='bg-red-600'>
                      {exercise.status === "started"
                        ? "Continue"
                        : exercise.status === "completed" && "View"}
                    </a>
                  </Link>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            {exercisesData
              .filter(
                (exercise) => exercise.difficulty.toLowerCase() === filter
              )
              .map((exercise) => (
                <Link key={exercise.id} href={`exercises/${exercise.id}`}>
                  <a className='bg-yellow-600 px-4 py-5'>
                    <div>
                      <span>{exercise.difficulty}</span>
                      <h3>{exercise.title}</h3>
                      <div className='flex'>
                        <div>
                          <span>{exercise._count.tasks}</span>
                          <span>Tasks</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p>{exercise.description}</p>
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
    const exercisesData = await prisma.exercise.findMany({
      select: {
        title: true,
        description: true,
        id: true,
        difficulty: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    const exercisesStatus = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
      select: {
        completed_exercises: {
          select: {
            exercises: {
              select: {
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
              },
            },
          },
        },
      },
    });

    const completedExercises: any = [];
    const startedExercises: any = [];

    exercisesStatus?.completed_exercises.forEach((exercise) =>
      exercise.exercises.forEach((exercise) =>
        completedExercises.push({ id: exercise.id })
      )
    );
    exercisesStatus?.started_exercises.forEach((exercise) =>
      exercise.exercises.forEach((exercise) =>
        startedExercises.push({ id: exercise.id })
      )
    );

    const cleanData = exercisesData.map((exercise) => {
      const completedExercise = completedExercises.find(
        (completedExercise: { id: number }) =>
          completedExercise.id === exercise.id
      );
      const startedExercise = startedExercises.find(
        (startedExercise: { id: number }) => startedExercise.id === exercise.id
      );

      if (exercise.id === completedExercise?.id)
        return { ...exercise, status: "completed" };
      if (exercise.id === startedExercise?.id)
        return { ...exercise, status: "started" };
      else return { ...exercise, status: "not started" };
    });

    return {
      props: {
        exercisesData: cleanData,
      },
    };
  }
}
