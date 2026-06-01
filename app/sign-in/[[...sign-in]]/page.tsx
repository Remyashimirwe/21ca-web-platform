"use client";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Globe,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const { theme, setTheme } = useTheme();

  const getClerkAppearance = () => {
    const baseAppearance = {
      variables: {
        colorPrimary: "hsl(142, 76%, 36%)",
        colorBackground: theme === "dark" ? "hsl(222, 47%, 8%)" : "hsl(0, 0%, 100%)",
        colorInputBackground: theme === "dark" ? "hsl(222, 47%, 10%)" : "hsl(0, 0%, 100%)",
        colorInputText: theme === "dark" ? "hsl(210, 40%, 96%)" : "hsl(222, 47%, 11%)",
        colorText: theme === "dark" ? "hsl(210, 40%, 96%)" : "hsl(222, 47%, 11%)",
        colorTextSecondary: theme === "dark" ? "hsl(215, 20%, 65%)" : "hsl(215, 16%, 47%)",
        borderRadius: "0.9rem",
        fontFamily: "inherit",
      },
      elements: {
        card:
            theme === "dark"
                ? "shadow-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl"
                : "shadow-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl",
        headerTitle: theme === "dark" ? "text-slate-100" : "text-slate-900",
        headerSubtitle: theme === "dark" ? "text-slate-400" : "text-slate-600",
        socialButtonsBlockButton:
            theme === "dark"
                ? "border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-100 transition-all duration-200 hover:shadow-md"
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 transition-all duration-200 hover:shadow-sm",
        formFieldInput:
            theme === "dark"
                ? "border border-white/10 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20",
        formFieldLabel: theme === "dark" ? "text-slate-200" : "text-slate-700",
        identityPreviewText: theme === "dark" ? "text-slate-100" : "text-slate-900",
        formResendCodeLink: "text-emerald-600 hover:text-emerald-700 transition-colors duration-200",
        footerActionLink: "text-emerald-600 hover:text-emerald-700 transition-colors duration-200",
        formFieldInputShowPasswordButton:
            theme === "dark"
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-700",
        dividerLine: theme === "dark" ? "bg-white/10" : "bg-slate-200",
        dividerText: theme === "dark" ? "text-slate-400" : "text-slate-500",
        alertError:
            theme === "dark"
                ? "bg-red-950/30 border-red-900 text-red-300"
                : "bg-red-50 border-red-200 text-red-700",
        formButtonPrimary:
            "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200",
      },
    };

    if (theme === "dark") {
      return {
        baseTheme: dark,
        ...baseAppearance,
      };
    }

    return baseAppearance;
  };

  const features = [
    {
      icon: BookOpen,
      title: "Expert courses",
      description: "Learn from trusted instructors.",
    },
    {
      icon: Users,
      title: "Community learning",
      description: "Grow with other learners.",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognition as you finish.",
    },
  ];

  const stats = [
    { label: "Students", value: "1,000+" },
    { label: "Courses", value: "75+" },
    { label: "Success", value: "95%" },
  ];

  return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-[-5rem] left-[-4rem] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <header className="absolute left-0 right-0 top-0 z-20">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
                href="/"
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-emerald-600">
                <Image
                    src="/logo.png"
                    alt="21st Century Academy Logo"
                    width={26}
                    height={26}
                    className="h-6 w-6"
                />
              </div>
              <span className="hidden text-sm font-semibold text-foreground sm:inline-flex">
              21st Century Academy
            </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setTheme('light')}
                  aria-label="Light theme"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setTheme('dark')}
                  aria-label="Dark theme"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setTheme('system')}
                  aria-label="System theme"
              >
                <Monitor className="h-4 w-4" />
              </Button>

              <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid w-full items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
            <section className="relative hidden overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-8 shadow-xl lg:flex lg:flex-col lg:justify-between dark:from-emerald-950/20 dark:via-slate-950 dark:to-blue-950/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />
              <div className="relative space-y-6">
                <div className="max-w-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/8 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <Sparkles className="h-4 w-4" />
                    Welcome back
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-4xl">
                    Continue your learning journey
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground xl:text-base">
                    Sign in to access your dashboard and keep learning with 21st Century Academy.
                  </p>
                </div>

                <div className="grid gap-3">
                  {features.map((feature) => (
                      <div
                          key={feature.title}
                          className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {feature.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {stats.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-muted/40 px-3 py-3">
                        <div className="text-xl font-bold text-foreground">
                          {item.value}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {item.label}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="mb-6 text-center lg:text-left">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/8 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 lg:hidden">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure access
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Sign In
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                    Welcome back. Please sign in to continue to your dashboard.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                  <SignIn
                      appearance={getClerkAppearance()}
                      redirectUrl="/dashboard"
                      signUpUrl="/sign-up"
                  />
                </div>

                <div className="mt-6 text-center lg:text-left">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
}