import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCommunityPost,
  deleteCommunityPost,
  updateCommunityPost,
} from '@api/community.api';
import { community } from '@api/keys/community.key';

export const useCreateCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: community._def,
      }),
  });
};

export const useUpdateCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommunityPost,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: community._def,
      }),
  });
};

export const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: community._def,
      }),
  });
};
