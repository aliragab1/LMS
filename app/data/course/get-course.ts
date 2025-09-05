import 'server-only';

import prisma from '@/lib/db';
import { notFound } from 'next/navigation';

export async function getCourse(courseSlug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      smallDescription: true,
      chapters: {
        orderBy: {
          position: 'asc',
        },
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  return course;
}

export type PublicCourseSingularType = Awaited<ReturnType<typeof getCourse>>;
