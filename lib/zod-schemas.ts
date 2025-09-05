import * as z from 'zod';
import { CourseLevel, CourseStatus } from './generated/prisma';

export const courseCategories = [
  'Development',
  'Business',
  'Finance',
  'It & Software',
  'Office Productivity',
  'Personal Development',
  'Design',
  'Marketing',
  'Health & Fitness',
  'Music',
  'Teaching & Academics',
] as const;

export const courseLevels = [
  CourseLevel.Beginner,
  CourseLevel.Intermediate,
  CourseLevel.Advanced,
] as const;

export const courseStatus = [
  CourseStatus.Draft,
  CourseStatus.Published,
  CourseStatus.Archived,
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 character long' })
    .max(100, { message: 'Title must be at most 100 characters long' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .max(3000, { message: 'Description must be at most 3000 characters long' }),
  fileKey: z
    .string()
    .min(1, { message: 'File key must be at least 1 character long' }),
  price: z.coerce
    .number<number>()
    .min(1, { message: 'Price must be at least 1' }),
  duration: z.coerce
    .number<number>()
    .min(1, { message: 'Duration must be at least 1' })
    .max(500, { message: 'Duration must be at most 500' }),
  level: z.enum(CourseLevel, { message: 'Invalid course level' }),
  category: z.enum(courseCategories, { message: 'Category is required' }),
  smallDescription: z
    .string()
    .min(3, { message: 'Small description must be at least 3 characters long' })
    .max(250, {
      message: 'Small description must be at most 250 characters long',
    }),
  slug: z
    .string()
    .min(3, { message: 'Slug must be at least 3 characters long' }),
  status: z.enum(CourseStatus, { message: 'Invalid course status' }),
});

export type CourseFormValuesType = z.infer<typeof courseSchema>;

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  courseId: z.uuid({ message: 'Invalid course id' }),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' }),
  courseId: z.uuid({ message: 'Invalid course id' }),
  chapterId: z.uuid({ message: 'Invalid chapter id' }),
  description: z
    .string()
    .min(3, { message: 'Description must be at least 3 characters long' })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
