import { create } from 'zustand';
import axiosInstance from '../libs/api/instance';

const useCommunityStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  comments: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/community-posts');

      if (response.data.error) {
        set({ error: response.data.error, isLoading: false });
        return false;
      } else {
        const sortedPosts = response.data.data.sort((a, b) => {
          const dateA = new Date(
            ...a.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
          );
          const dateB = new Date(
            ...b.created_at.slice(0, 6).map((v, i) => (i === 1 ? v - 1 : v)),
          );
          return dateB - dateA;
        });
        set({ posts: sortedPosts, isLoading: false });
        return true;
      }
    } catch (error) {
      console.error('게시글 목록 불러오기 실패:', error);
      set({
        error: '게시글을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      });
      return false;
    }
  },

  fetchPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/community-posts');

      if (response.data.error) {
        set({ error: response.data.error, isLoading: false });
        return false;
      } else {
        const foundPost = response.data.data.find(
          (p) => p.id === parseInt(postId),
        );
        if (foundPost) {
          set({ currentPost: foundPost, isLoading: false });
          return true;
        } else {
          set({ error: '존재하지 않는 게시글입니다.', isLoading: false });
          return false;
        }
      }
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
      set({
        error: '게시글을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      });
      return false;
    }
  },

  fetchComments: async (postId) => {
    try {
      const response = await axiosInstance.get(
        `/api/community-posts/comments/post/${postId}`,
      );

      if (response.data.error) {
        set({ error: response.data.error });
        return false;
      } else {
        set({ comments: response.data.data || [] });
        return true;
      }
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
      return false;
    }
  },

  createPost: async (userId, title, content, category) => {
    try {
      const response = await axiosInstance.post('/api/community-posts', {
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        category: category,
      });

      if (response.data.error) {
        set({ error: response.data.error });
        return false;
      } else {
        get().fetchPosts();
        return true;
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      set({ error: '게시글 작성 중 오류가 발생했습니다.' });
      return false;
    }
  },

  updatePost: async (postId, userId, title, content, category) => {
    try {
      const response = await axiosInstance.put('/api/community-posts', {
        post_id: parseInt(postId),
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
        category: category,
      });

      if (response.data.error) {
        set({ error: response.data.error });
        return false;
      } else {
        get().fetchPost(postId);
        return true;
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      set({ error: '게시글 수정 중 오류가 발생했습니다.' });
      return false;
    }
  },

  deletePost: async (postId, userId) => {
    try {
      const response = await axiosInstance.delete('/api/community-posts', {
        data: {
          post_id: parseInt(postId),
          user_id: userId,
        },
      });

      if (response.data.error) {
        set({ error: response.data.error });
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      set({ error: '게시글 삭제 중 오류가 발생했습니다.' });
      return false;
    }
  },

  createComment: async (postId, userId, content, parentCommentId = null) => {
    try {
      const requestData = {
        post_id: parseInt(postId),
        user_id: userId,
        comment_content: content.trim(),
      };

      if (parentCommentId) {
        requestData.parent_comment_id = parentCommentId;
      }

      const response = await axiosInstance.post(
        '/api/community-posts/comments',
        requestData,
      );

      if (response.data.error) {
        set({ error: response.data.error });
        return false;
      } else {
        get().fetchComments(postId);
        return true;
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      set({ error: '댓글 작성 중 오류가 발생했습니다.' });
      return false;
    }
  },

  deleteComment: async (commentId, userId, postId) => {
    try {
      const response = await axiosInstance.delete(
        '/api/community-posts/comments',
        {
          data: {
            comment_id: commentId,
            user_id: userId,
          },
        },
      );

      if (response.data.error) {
        if (
          response.data.error.includes(
            '대댓글이 있는 댓글은 삭제할 수 없습니다',
          )
        ) {
          alert('대댓글이 달린 댓글은 삭제할 수 없습니다.');
          return false;
        } else {
          set({ error: response.data.error });
          return false;
        }
      } else {
        // 댓글 목록 새로고침
        get().fetchComments(postId);
        return true;
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      set({ error: '댓글 삭제 중 오류가 발생했습니다.' });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentPost: () => set({ currentPost: null }),

  clearComments: () => set({ comments: [] }),
}));

export default useCommunityStore;
