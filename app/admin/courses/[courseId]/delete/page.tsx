'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { tryCatch } from '@/hooks/try-catch';
import { cn } from '@/lib/utils';
import { Loader, Trash } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { deleteCourse } from './actions';
import { useTransition } from 'react';
import { toast } from 'sonner';

const DeleteCoursePage = () => {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function handleDeleteCourse() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));
      if (error) {
        toast.error('An unexpected error occured. please try again.');
        return;
      }
      if (data?.status === 'success') {
        toast.success(data.message);
        router.push(`/admin/courses`);
      } else if (data?.status === 'error') {
        toast.error(data.message);
      }
    });
  }
  return (
    <>
      <div className="max-w-xl mx-auto w-full">
        <Card className="mt-32">
          <CardHeader>
            <CardTitle>Are you absolutely sure?</CardTitle>
            <CardDescription>
              This action cannot be undone. This will permanently delete this
              course.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-4 justify-end">
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              href={'/admin/courses'}
            >
              Cancel
            </Link>
            <Button
              onClick={handleDeleteCourse}
              disabled={pending}
              variant={'destructive'}
              type="button"
            >
              Delete{' '}
              {pending ? (
                <Loader className="size-4 animate-spin" />
              ) : (
                <Trash className="size-4" />
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default DeleteCoursePage;
