'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { Loader, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteChapter } from '../actions';
import { toast } from 'sonner';

interface iDeleteChapterProps {
  courseId: string;
  chapterId: string;
}

export const DeleteChapter = ({ courseId, chapterId }: iDeleteChapterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDeleteChapter = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter({ chapterId, courseId })
      );
      if (error) {
        toast.error('An unexpected error occured. please try again.');
        return;
      }
      if (result?.status === 'success') {
        toast.success(result.message);
        setIsOpen(false);
      } else if (result?.status === 'error') {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <Trash2 size={4} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            chapter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleDeleteChapter} disabled={pending}>
            {pending ? (
              <>
                Deleting...
                <Loader className="size-4 animate-spin" />
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
