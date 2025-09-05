import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive';

import { EmptyState } from '@/components/general/empty-state';
import { SectionCards } from '@/components/sidebar/section-cards';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { adminGetEnrollmentStats } from '../data/admin/admin-get-enrollment-stats';
import { adminGetRecentCourses } from '../data/admin/admin-get-recent-courses';
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from './courses/_components/admin-course-card';

const AdminPage = async () => {
  const enrollmentData = await adminGetEnrollmentStats();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Course</h2>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
};
export default AdminPage;

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0)
    return (
      <EmptyState
        buttonText="Create new course"
        description="You don't have any courses. Create some to see them here."
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}
async function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <AdminCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
