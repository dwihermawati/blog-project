import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import useLikePost from './usePostLike';
import usePostLikes from './useGetLikes';

function usePostLikeState(post: BlogPost) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { mutate } = useLikePost();

  const { data: likedUsers, isLoading: likesLoading } = usePostLikes({
    postId: post.id,
  });

  const isLikedByUser = useMemo(() => {
    return likedUsers?.some((u) => u.id === user?.id) ?? false;
  }, [likedUsers, user?.id]);

  const [isLiked, setIsLiked] = useState(isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isOptimistic, setIsOptimistic] = useState(false);

  useEffect(() => {
    if (!isOptimistic) {
      setIsLiked(isLikedByUser);
      setLikesCount(likedUsers?.length ?? post.likes);
    }
  }, [isLikedByUser, likedUsers, post.likes, isOptimistic]);

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.info('You must be logged in to give a like!');
      navigate('/login');
      return;
    }

    setIsOptimistic(true);
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    mutate(post.id, {
      onError: () => {
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        setIsOptimistic(false);
      },
    });
  };

  return {
    isLiked,
    likesCount,
    handleLikeClick,
    likesLoading,
  };
}

export default usePostLikeState;
