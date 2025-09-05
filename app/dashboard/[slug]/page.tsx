import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data';
import { redirect } from 'next/navigation';

interface iSlugPageProps {
  params: Promise<{ slug: string }>;
}

const SlugPage = async ({ params }: iSlugPageProps) => {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  const firstChapter = course.course.chapters[0];
  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) redirect(`/dashboard/${slug}/${firstLesson.id}`);

  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold">No lessons available</h2>
      <p className="text-muted-foreground">
        This course does not have any lessons yet!
      </p>
    </div>
  );
};
export default SlugPage;
