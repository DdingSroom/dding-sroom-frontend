import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createComment, deleteComment } from '@api/comment.api';
import { comment } from '@api/keys/comment.key';

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: comment._def,
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: comment._def,
      });
    },
  });
};
