"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Sparkles,
  Target,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SignUpContent() {
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

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
                ? "border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-100 transition-all duration-200"
                : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 transition-all duration-200",
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
            "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200",
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

  const benefits = [
    {
      icon: Target,
      title: "Personalized path",
      description: "Learn based on your goals.",
    },
    {
      icon: Shield,
      title: "Secure access",
      description: "Your account stays protected.",
    },
  ];

  return (
      <div className="h-screen overflow-hidden bg-background">
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
              <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setTheme('light')} aria-label="Light theme">
                <Sun className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setTheme('dark')} aria-label="Dark theme">
                <Moon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => setTheme('system')} aria-label="System theme">
                <Monitor className="h-4 w-4" />
              </Button>

              <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto flex h-screen w-full max-w-7xl items-center px-4 pt-20 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2">
            <section className="hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-8 shadow-xl lg:flex lg:flex-col dark:from-blue-950/20 dark:via-slate-950 dark:to-emerald-950/20">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/8 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Join today
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Start your learning journey
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Create your account and unlock courses, certificates, and community learning.
              </p>

              <div className="mt-6 space-y-3">
                {benefits.map((item) => (
                    <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                ))}
              </div>
            </section>

            <section className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="mb-5 text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Sign Up
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your account to get started.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/80 p-3 shadow-2xl backdrop-blur-xl sm:p-5">
                  <SignUp
                      appearance={getClerkAppearance()}
                      routing="path"
                      path="/sign-up"
                      signInUrl="/sign-in"
                      forceRedirectUrl={redirectUrl}
                      fallbackRedirectUrl={redirectUrl}
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-medium text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
                    >
                      Sign in here
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

export default function SignUpPage() {
  return (
      <Suspense fallback={<div className="h-screen bg-background" />}>
        <SignUpContent />
      </Suspense>
  );
}