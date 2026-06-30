import Link from 'next/link';

import { getPostPreviewViewModel } from '@utils/post-preview';

interface PostPreviewProps {
  id: number;
  title: string;
  content: string;
  category: number;
  created_at?: number[];
}

export default function PostPreview({
  id,
  title,
  content,
  category,
  created_at: createdAtArray,
}: PostPreviewProps) {
  const { categoryName, createdAtDateTime, createdAtText } =
    getPostPreviewViewModel({
      category,
      createdAt: createdAtArray,
    });

  return (
    <li className="list-none">
      <article className="border-gray-200">
        <Link
          href={`/community/${id}`}
          className="block px-4 py-3 active:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <header className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-500">
              {categoryName}
            </span>
            <time
              dateTime={createdAtDateTime}
              className="text-sm text-gray-400"
            >
              {createdAtText}
            </time>
          </header>

          <h3 className="mb-1 text-body-01 font-medium text-gray-900 leading-snug line-clamp-1">
            {title}
          </h3>

          <p className="text-caption text-gray-600 line-clamp-1">{content}</p>
        </Link>
      </article>
    </li>
  );
}
