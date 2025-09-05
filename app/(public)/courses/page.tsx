import { getAllCourses } from '@/app/data/course/get-all-courses';
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from '../_components/public-course-card';
import { Suspense } from 'react';

const PublicCoursesPage = () => {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses, designed to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
};
export default PublicCoursesPage;

const RenderCourses = async () => {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
};

const PublicCourseCardSkeletonLayout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PublicCourseCardSkeleton key={i} />
      ))}
    </div>
  );
};
