'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Chrome,
  Github,
  KeyRound,
  Mail,
  Monitor,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthFrameProps {
  mode: AuthMode;
  children: (appearance: ReturnType<typeof buildClerkAppearance>) => React.ReactNode;
}

const modeCopy = {
  'sign-in': {
    eyebrow: 'Member access',
    title: 'Sign in to continue learning',
    subtitle: 'Use Google, GitHub, email, username, or password through Clerk.',
    visualTitle: 'Your courses are waiting.',
    visualText: 'Pick up lessons, track your progress, and stay connected with instructors from one secure account.',
    switchText: "Don't have an account?",
    switchHref: '/sign-up',
    switchLabel: 'Create one',
  },
  'sign-up': {
    eyebrow: 'Start learning',
    title: 'Create your learner account',
    subtitle: 'Join with Google, GitHub, email, username, and password when enabled in Clerk.',
    visualTitle: 'Build skills with a modern academy.',
    visualText: 'Create a profile, enroll in programs, collect certificates, and follow a guided path from day one.',
    switchText: 'Already registered?',
    switchHref: '/sign-in',
    switchLabel: 'Sign in',
  },
};

const accountOptions = [
  { label: 'Google', icon: Chrome },
  { label: 'GitHub', icon: Github },
  { label: 'Email', icon: Mail },
  { label: 'Username', icon: UserRound },
  { label: 'Password', icon: KeyRound },
];

const proofPoints = [
  { value: '75+', label: 'Courses' },
  { value: '1k+', label: 'Learners' },
  { value: '95%', label: 'Completion focus' },
];

const highlights = [
  {
    title: 'Verified access',
    description: 'Sessions, OAuth, email, and passwords stay managed by Clerk.',
    icon: ShieldCheck,
  },
  {
    title: 'Learning dashboard',
    description: 'Return directly to enrolled programs and active coursework.',
    icon: BookOpenCheck,
  },
  {
    title: 'Community ready',
    description: 'Designed for learners, instructors, and academy teams.',
    icon: UsersRound,
  },
];

function buildClerkAppearance(theme: string | undefined) {
  const isDark = theme === 'dark';

  return {
    baseTheme: isDark ? dark : undefined,
    variables: {
      colorPrimary: 'hsl(217.2, 91.2%, 59.8%)',
      colorBackground: isDark ? 'hsl(222.2, 84%, 4.9%)' : 'hsl(0, 0%, 100%)',
      colorInputBackground: isDark ? 'hsl(217.2, 32.6%, 17.5%)' : 'hsl(0, 0%, 100%)',
      colorInputText: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 4.9%)',
      colorText: isDark ? 'hsl(210, 40%, 98%)' : 'hsl(222.2, 84%, 4.9%)',
      colorTextSecondary: isDark ? 'hsl(215, 20.2%, 65.1%)' : 'hsl(215.4, 16.3%, 46.9%)',
      borderRadius: '0.75rem',
      fontFamily: 'inherit',
      fontSize: '14px',
    },
    elements: {
      rootBox: 'w-full',
      card: 'w-full border-0 bg-transparent p-0 shadow-none',
      header: 'hidden',
      main: 'gap-5',
      socialButtons: 'gap-3',
      socialButtonsBlockButton:
        'h-12 rounded-lg border border-border bg-background text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:shadow-md',
      socialButtonsBlockButtonText: 'text-sm font-semibold',
      dividerLine: 'bg-border',
      dividerText: 'text-muted-foreground text-xs font-semibold uppercase',
      form: 'gap-4',
      formField: 'gap-2',
      formFieldLabel: 'text-sm font-semibold text-foreground',
      formFieldInput:
        'h-12 rounded-lg border border-input bg-background px-4 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15',
      formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
      formButtonPrimary:
        'h-12 rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25',
      footer: 'hidden',
      formFieldAction: 'text-primary hover:text-primary/80',
      footerActionLink: 'text-primary hover:text-primary/80',
      identityPreview: 'rounded-lg border border-border bg-muted/40',
      identityPreviewText: 'text-foreground',
      identityPreviewEditButton: 'text-primary hover:text-primary/80',
      formResendCodeLink: 'text-primary hover:text-primary/80',
      alert: 'rounded-lg border',
      alertText: 'text-sm',
      alertError: 'border-destructive/30 bg-destructive/10 text-destructive',
      otpCodeFieldInput:
        'rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/15',
    },
  };
}

export default function AuthFrame({ mode, children }: AuthFrameProps) {
  const { theme, setTheme } = useTheme();
  const copy = modeCopy[mode];
  const appearance = buildClerkAppearance(theme);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f2ea] text-slate-950 dark:bg-[#07110f] dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.04),transparent_34%,rgba(37,99,235,0.08)),radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_86%_80%,rgba(245,158,11,0.16),transparent_26%)] dark:bg-[linear-gradient(115deg,rgba(255,255,255,0.06),transparent_34%,rgba(37,99,235,0.12)),radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.14),transparent_24%),radial-gradient(circle_at_86%_80%,rgba(245,158,11,0.12),transparent_26%)]" />

      <header className="fixed left-0 right-0 top-0 z-30">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg border border-white/60 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-xl transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm dark:bg-white/90">
              <Image src="/logo.png" alt="21st Century Academy" width={30} height={30} className="h-7 w-7 object-contain" />
            </span>
            <span className="truncate text-sm font-black text-slate-950 dark:text-white sm:text-base">21st Century Academy</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-lg border border-white/60 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:flex">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" onClick={() => setTheme('light')} aria-label="Light theme">
                <Sun className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" onClick={() => setTheme('dark')} aria-label="Dark theme">
                <Moon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" onClick={() => setTheme('system')} aria-label="System theme">
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/60 bg-white/70 px-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition-colors hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 pb-8 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)] lg:px-8">
        <section className="relative hidden min-h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-white/60 bg-slate-950 shadow-2xl shadow-slate-950/20 dark:border-white/10 lg:block">
          <Image src={mode === 'sign-in' ? '/welcome.jpg' : '/slide1.jpg'} alt="21st Century Academy learners" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,6,23,0.88),rgba(2,6,23,0.42)_48%,rgba(37,99,235,0.16)),linear-gradient(0deg,rgba(2,6,23,0.68),transparent_42%)]" />

          <div className="relative flex min-h-[calc(100vh-8rem)] flex-col justify-between p-8 xl:p-10">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-amber-300" />
                {copy.eyebrow}
              </div>
              <h1 className="max-w-xl text-5xl font-black leading-[1.02] text-white xl:text-6xl">
                {copy.visualTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
                {copy.visualText}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-3">
                {proofPoints.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl">
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="mt-1 text-xs font-semibold uppercase text-white/65">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-4 text-white shadow-sm backdrop-blur-xl">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-white/70">{item.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="w-full max-w-[480px]">
            <div className="mb-5 rounded-lg border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-black uppercase text-white dark:bg-white dark:text-slate-950">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {copy.eyebrow}
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl">
                    {copy.title}
                  </h2>
                </div>
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25 sm:flex">
                  <ShieldCheck className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-white/70">
                {copy.subtitle}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-5 gap-2">
              {accountOptions.map((option) => (
                <div key={option.label} className="group flex h-14 items-center justify-center rounded-lg border border-white/60 bg-white/80 text-slate-600 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white hover:text-blue-700 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white" title={option.label}>
                  <option.icon className="h-5 w-5" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-950/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/35 sm:p-6">
              {children(appearance)}
            </div>

            <p className="mt-5 text-center text-sm font-medium text-slate-600 dark:text-white/70">
              {copy.switchText}{' '}
              <Link href={copy.switchHref} className="font-black text-blue-700 transition-colors hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">
                {copy.switchLabel}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
