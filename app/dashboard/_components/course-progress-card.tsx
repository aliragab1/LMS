/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { EnrolledCourseType } from '@/app/data/user/get-enrolled-courses';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useContructUrl } from '@/hooks/use-construct-url';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface iCourseProgressCardProps {
  data: EnrolledCourseType;
}

export const CourseProgressCard = ({ data }: iCourseProgressCardProps) => {
  const thumbnailUrl = useContructUrl(data.course.fileKey);
  const { progressPercentage, completedLessons, totalLessons } =
    useCourseProgress({ courseData: data.course as any });
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail image of course"
        width={600}
        height={400}
        className="w-full  rounded-t-xl aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/dashboard/${data.course.slug}`}
        >
          {data.course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          className={cn(buttonVariants({ className: 'w-full mt-4' }))}
          href={`/dashboard/${data.course.slug}`}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
};

export const PublicCourseCardSkeleton = () => {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="mt-4 w-full rounded-md h-10" />
      </CardContent>
    </Card>
  );
};
