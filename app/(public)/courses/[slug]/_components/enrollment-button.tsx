'use client';

import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { useTransition } from 'react';
import { enrollInCourseAction } from '../actions';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

export const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [pending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollInCourseAction(courseId));
      if (error) {
        toast.error('An unexpected error occured. please try again.');
        return;
      }
      if (data?.status === 'success') {
        toast.success(data.message);
      } else if (data?.status === 'error') {
        toast.error(data.message);
      }
    });
  };
  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>Enroll Now</>
      )}
    </Button>
  );
};
