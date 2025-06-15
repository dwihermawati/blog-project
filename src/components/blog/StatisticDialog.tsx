import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeatLoader } from 'react-spinners';
import usePostLikes from '@/hooks/usePostLikes';
import useComments from '@/hooks/useComments';
import CommentCard from './CommentCard';
import LikeCard from './LikeCard';
import { Icon } from '@iconify/react';
import { ThumbsUp, XIcon } from 'lucide-react';

interface StatisticDialogProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  postLikesCount: number;
}

const StatisticDialog: React.FC<StatisticDialogProps> = ({
  postId,
  isOpen,
  onClose,
  postLikesCount,
}) => {
  const [activeTab, setActiveTab] = useState('likes');

  const {
    data: likedUsers,
    isLoading: isLikesLoading,
    isError: isLikesError,
    error: likesError,
  } = usePostLikes({
    postId: postId,
    enabled: isOpen && activeTab === 'likes',
  });

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useComments({
    postId: postId,
    enabled: isOpen && activeTab === 'comments',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[700px] max-w-[613px] flex-col'>
        <DialogHeader>
          <DialogTitle>Statistic</DialogTitle>
          <DialogClose>
            <XIcon className='size-6 cursor-pointer text-neutral-950 hover:text-neutral-500' />
          </DialogClose>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1'>
          <TabsList className='hover:text-primary-300 w-full'>
            <TabsTrigger value='likes' className='flex-center gap-2'>
              <ThumbsUp className='size-5' /> Likes
            </TabsTrigger>
            <TabsTrigger value='comments' className='flex-center gap-2'>
              <Icon icon='proicons:comment' className='size-5' /> Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='likes'
            className='mt-3 flex-1 overflow-y-auto md:mt-5'
          >
            {isLikesLoading ? (
              <BeatLoader size={8} color='#0093DD' className='mx-auto' />
            ) : isLikesError ? (
              <p className='text-center text-red-500'>
                Error loading likers: {likesError?.message}
              </p>
            ) : likedUsers && likedUsers.length > 0 ? (
              <div className='flex flex-col gap-3 md:gap-5'>
                <span className='text-sm-bold md:text-lg-bold text-neutral-950'>
                  Like ({postLikesCount})
                </span>
                <div className='flex max-h-[300px] flex-col gap-3 overflow-y-auto'>
                  {likedUsers.map((user) => (
                    <LikeCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground text-center'>No likes yet.</p>
            )}
          </TabsContent>

          <TabsContent
            value='comments'
            className='mt-3 flex-1 overflow-y-auto md:mt-5'
          >
            {isCommentsLoading ? (
              <BeatLoader size={8} color='#0093DD' className='mx-auto' />
            ) : isCommentsError ? (
              <p className='text-center text-red-500'>
                Error loading comments: {commentsError?.message}
              </p>
            ) : commentsData && commentsData.length > 0 ? (
              <div className='flex flex-col gap-3 md:gap-5'>
                <span className='text-sm-bold md:text-lg-bold text-neutral-950'>
                  Comment ({commentsData.length})
                </span>
                <div className='flex max-h-[400px] flex-col gap-3 overflow-y-auto'>
                  {[...commentsData].reverse().map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-muted-foreground text-center'>
                No comments yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticDialog;
