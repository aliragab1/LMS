'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import prisma from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { request } from '@arcjet/next';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', window: '1m', max: 5 }));

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id,
    });

    if (decision.isDenied()) {
      // return {
      //   status: 'error',
      //   message: 'You are not allowed to create courses',
      // };
      if (decision.reason.isRateLimit()) {
        return {
          status: 'error',
          message: 'You have been blocked due to rate limiting',
        };
      } else {
        return {
          status: 'error',
          message: 'You are not a bot! if this a mistake contact our support',
        };
      }
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath('/admin/courses');

    return {
      status: 'success',
      message: 'Course deleted successfully',
    };
  } catch {
    return {
      status: 'error',
      message: 'Failed to delete course',
    };
  }
}
