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
