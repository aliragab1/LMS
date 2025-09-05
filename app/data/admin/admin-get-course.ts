import 'server-only';

import prisma from '@/lib/db';
import { requireAdmin } from './require-admin';
import { notFound } from 'next/navigation';

export async function adminGetCourse(id: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      category: true,
      description: true,
      level: true,
      price: true,
      fileKey: true,
      title: true,
      status: true,
      duration: true,
      smallDescription: true,
      slug: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!data) notFound();

  return data;
}

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
