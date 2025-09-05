'use client';

import { AdminLessonType } from '@/app/data/admin/admin-get-lesson';
import { Uploader } from '@/components/file-uploader/uploader';
import { RichTextEditor } from '@/components/rich-text-editor/editor';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { lessonSchema, LessonSchemaType } from '@/lib/zod-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { updateLesson } from '../actions';
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';

interface iLessonFormProps {
  data: AdminLessonType;
  courseId: string;
  chapterId: string;
}

export const LessonForm = ({ data, chapterId, courseId }: iLessonFormProps) => {
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId,
      courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson({ values, lessonId: data.id })
      );
      if (error) {
        toast.error('An unexpected error occured. please try again.');
        return;
      }
      if (result?.status === 'success') {
        toast.success(result.message);
      } else if (result?.status === 'error') {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <Link
        className={cn(
          buttonVariants({ variant: 'outline', className: 'mb-6' })
        )}
        href={`/admin/courses/${courseId}/edit`}
      >
        <ArrowLeft />
        Go Back
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail image</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video file</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    Save Lesson <Loader className="size-4 animate-spin" />
                  </>
                ) : (
                  <>Save Lesson</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
