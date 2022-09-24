import { PrismaClient } from "@prisma/client";
import jsonCertificatesData from './data/certificates.json'
import jsonCoursesData from './data/courses.json'
import jsonExercisesData from './data/exercises.json'
import jsonTasksData from './data/tasks.json'



const prisma = new PrismaClient();

type Certificate = {
  title:string;
  id:number;
  short_description:string;
  long_description:string;
  type:'short'|'full'
}

type Course = {
  title:string;
  description:string;
  id:number;
  certificate_id:number;
  module:'fundamentals'|'intermediate'|'advanced'
}

type Exercise = {
  title:string;
  description:string;
  id:number;
  certificate_id:number;
  difficulty:'begginer'|'intermediate'|'advanced'
}

type Task = {
  todo:string;
  id:number;
  exercise_id:number;
}

function stringAndParse(data: {}) {
    const stringfyData = JSON.stringify(data);
    const parsedData = JSON.parse(stringfyData);
    return parsedData;
  }
  
async function certificatesSeed() {
  const certificatesData:Certificate[] = stringAndParse(jsonCertificatesData)
  const promises = certificatesData.map(certificate => {
    return prisma.certificate.upsert({
      where:{
        id:Number(certificate.id)
      },
      update:{},
      create:{
        title:certificate.title,
        short_description:certificate.short_description,
        long_description:certificate.long_description,
        type:certificate.type

      }
    })
  })

  Promise.all(promises)
}

async function courseSeed() {
  const coursesData:Course[] = stringAndParse(jsonCoursesData)
  const promises = coursesData.map(course => {
    return prisma.course.upsert({
      where:{
        id:course.id
      },
      update:{},
      create:{
        title:course.title,
        description:course.description,
        module:course.module,
        certificate:{
          connect:{
            id:course.certificate_id
          }
        }
      }
    })
  })

  await Promise.all(promises)
}

async function exerciseSeed() {
  const exercisesData:Exercise[] = stringAndParse(jsonExercisesData)
  const promises = exercisesData.map(exercise => {
    return prisma.exercise.upsert({
      where:{
        id:exercise.id
      },
      update:{},
      create:{
        title:exercise.title,
        description:exercise.description,
        difficulty:exercise.difficulty,
        certificate:{
          connect:{
            id:exercise.certificate_id
          }
        }
      }
    })
  })

  await Promise.all(promises)
}

async function tasksSeed() {
  const tasksData:Task[] = stringAndParse(jsonTasksData)
  const promises = tasksData.map(task => {
    return prisma.task.upsert({
      where:{
        id:task.id
      },
      update:{},
      create:{
        todo:task.todo,
        exercise:{
          connect:{
            id:task.exercise_id
          }
        }
      }
    })
  })

await Promise.all(promises)

}
const run = async () => {
  await certificatesSeed()
  await courseSeed()
  await exerciseSeed()
  await tasksSeed()
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });