'use server';

import { CourseFormValuesType, courseSchema } from '@/lib/zod-schemas';
import prisma from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { request } from '@arcjet/next';
import { stripe } from '@/lib/stripe';

const aj = arcjet.withRule(fixedWindow({ mode: 'LIVE', window: '1m', max: 5 }));

export const createCourse = async (
  values: CourseFormValuesType
): Promise<ApiResponse> => {
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

    const validation = courseSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      };
    }

    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.smallDescription,
      default_price_data: {
        currency: 'usd',
        unit_amount: validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id,
        stripePriceId: data.default_price as string,
      },
    });

    return {
      status: 'success',
      message: 'Course created successfully',
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Failed to create course',
    };
  }
};
