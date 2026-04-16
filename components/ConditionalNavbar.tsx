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
  ];

  const shouldHideNavbar = hiddenRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <div className="h-14 sm:h-16" aria-hidden="true" />
      <Navbar />
    </>
  );
}