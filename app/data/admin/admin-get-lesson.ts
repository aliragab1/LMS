import 'server-only';

import prisma from '@/lib/db';
import { requireAdmin } from './require-admin';
import { notFound } from 'next/navigation';

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
    },
  });

  if (!data) notFound();

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
