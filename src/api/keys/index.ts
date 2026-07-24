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
