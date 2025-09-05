import { adminGetLesson } from '@/app/data/admin/admin-get-lesson';
import { LessonForm } from './_components/lesson-form';

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

const LessonIdPage = async ({ params }: { params: Params }) => {
  const { courseId, chapterId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);

  return (
    <>
      <LessonForm data={lesson} courseId={courseId} chapterId={chapterId} />
    </>
  );
};
export default LessonIdPage;
