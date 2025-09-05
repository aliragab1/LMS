import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CourseForm } from './_components/course-form';

const CreateCoursePage = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={'/admin/courses'}
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create a New Course</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </>
  );
};
export default CreateCoursePage;
