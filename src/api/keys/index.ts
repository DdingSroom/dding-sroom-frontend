import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { admin } from './admin.key';
import { suggestion } from './suggestion.key';
import { community } from './community.key';
import { comment } from './comment.key';
import { notification } from './notification.key';
import { reservation } from './reservation.key';

export const queries = {
  admin,
  ...mergeQueryKeys(suggestion, community, comment, notification, reservation),
};

// [ queryKey 단일 호출 예시 ]
// 1. admin query-key : queries.admin.admin.users.getAll().queryKey
// 2. 그 외 query-key : queries.suggestion.getAll().queryKey

// [ queryKey & queryFn 호출 예시 ]
// 1. admin query-key : ...queries.admin.admin.users.getAll()
// 2. 그 외 query-key : ...queries.suggestion.getAll()
