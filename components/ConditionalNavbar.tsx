'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // List of routes where navbar should NOT appear
  const hiddenRoutes = [
    '/admin',
    '/dashboard',
    '/sign-in',
    '/sign-up',
    '/instructor'
  ];
  
  // Check if current path starts with any of the hidden routes
  const shouldHideNavbar = hiddenRoutes.some(route => 
    pathname?.startsWith(route)
  );
  
  // Don't render navbar on specified routes
  if (shouldHideNavbar) {
    return null;
  }
  
  return <Navbar />;
}