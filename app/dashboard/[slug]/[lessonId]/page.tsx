import { getLessonContent } from '@/app/data/course/get-lesson-content';
import { CourseContent } from './_components/course-content';
import { Suspense } from 'react';
import { LessonSkeleton } from './_components/lesson-skeleton';

interface iLessonIdPageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

const LessonIdPage = async ({ params }: iLessonIdPageProps) => {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonIdLoader lessonId={lessonId} />
    </Suspense>
  );
};
export default LessonIdPage;

async function LessonIdLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);

  return <CourseContent data={data} />;
}
