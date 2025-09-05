import 'server-only';

import { requireAdmin } from './require-admin';
import prisma from '@/lib/db';

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalSignups, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      // Total signups
      prisma.user.count(),

      // Total customers
      prisma.user.count({
        where: {
          enrollments: {
            some: {},
          },
        },
      }),

      // Total courses
      prisma.course.count(),

      // Total lessons
      prisma.lesson.count(),
    ]);

  return { totalSignups, totalCustomers, totalCourses, totalLessons };
}
