'use client';

import { type ComponentProps, type MouseEvent } from 'react';
import Link from 'next/link';

import { useNavigationGuardContext } from './NavigationGuardProvider';
import { useGuardedNavigate } from './useGuardedNavigate';

interface GuardedLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string;
}

export default function GuardedLink({
  href,
  onClick,
  children,
  ...rest
}: GuardedLinkProps) {
  const { isDirty } = useNavigationGuardContext();
  const { push } = useGuardedNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) {
      return;
    }
    const isModifiedClick =
      e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    const opensInNewTab = rest.target && rest.target !== '_self';
    if (isModifiedClick || opensInNewTab) {
      return;
    }
    if (!isDirty) {
      return;
    }
    e.preventDefault();
    push(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
