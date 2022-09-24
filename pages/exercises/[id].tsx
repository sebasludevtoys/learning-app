import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/prisma";

type Task = {
  todo: string;
  id: number;
};

type data = {
  title: string;
  description: string;
  tasks: Task[];
};

const Page = ({ exerciseData }: { exerciseData: data }) => {
  return (
    <div>
      <h2>{exerciseData.title}</h2>
      <p>{exerciseData.description}</p>
      <div>
        <h2>todos:</h2>
        {exerciseData.tasks.map((task) => (
          <p key={task.id}>{task.todo}</p>
        ))}
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
    const exerciseData = await prisma.exercise.findUnique({
      where: {
        id: +context.params.id,
      },
      select: {
        title: true,
        description: true,
        difficulty: true,
        tasks: {
          select: {
            id: true,
            todo: true,
          },
        },
      },
    });
    return {
      props: {
        exerciseData,
      },
    };
  }
}
