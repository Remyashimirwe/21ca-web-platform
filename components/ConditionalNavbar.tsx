'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hiddenRoutes = [
    '/admin',
    '/dashboard',
    '/sign-in',
    '/sign-up',
    '/instructor',
    '/messages',
    '/notifications',
    '/my-courses',
    '/payment',
    '/premium',
    '/courses/',
    '/programs/',
    '/community',
    '/certificates',
    '/settings',
    '/calendar',
    '/support',
    '/partner',
    '/profile',
  ];

  const shouldHideNavbar = hiddenRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <div className="h-20 lg:h-24" aria-hidden="true" />
      <Navbar />
    </>
  );
}
