'use client'
import { SignIn } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, Award, Globe } from 'lucide-react';

export default function SignInPage() {
    const { theme } = useTheme();

    // Create theme-aware appearance
    const getClerkAppearance = () => {
        const baseAppearance = {
            variables: {
                colorPrimary: theme === 'dark' ? 'hsl(142, 76%, 36%)' : 'hsl(142, 76%, 36%)', // Green primary
                colorBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                colorInputBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                colorInputText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                colorText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                colorTextSecondary: theme === 'dark' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 47%)',
                borderRadius: '0.5rem',
                fontFamily: 'inherit',
            },
            elements: {
                formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105",
                card: theme === 'dark'
                    ? "shadow-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-sm"
                    : "shadow-2xl border border-slate-200 bg-white/95 backdrop-blur-sm",
                headerTitle: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                headerSubtitle: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                socialButtonsBlockButton: theme === 'dark'
                    ? "border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all duration-200 hover:scale-105"
                    : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 transition-all duration-200 hover:scale-105",
                formFieldInput: theme === 'dark'
                    ? "border border-slate-700 bg-slate-800 text-slate-100 focus:border-green-500 focus:ring-green-500/20"
                    : "border border-slate-200 bg-white text-slate-900 focus:border-green-500 focus:ring-green-500/20",
                formFieldLabel: theme === 'dark' ? "text-slate-200" : "text-slate-700",
                identityPreviewText: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                formResendCodeLink: "text-green-600 hover:text-green-700 transition-colors duration-200",
                footerActionLink: "text-green-600 hover:text-green-700 transition-colors duration-200",
                formFieldInputShowPasswordButton: theme === 'dark'
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-500 hover:text-slate-700",
                dividerLine: theme === 'dark' ? "bg-slate-700" : "bg-slate-200",
                dividerText: theme === 'dark' ? "text-slate-400" : "text-slate-500",
                alertError: theme === 'dark'
                    ? "bg-red-900/20 border-red-800 text-red-400"
                    : "bg-red-50 border-red-200 text-red-700",
            }
        };

        // Use Clerk's dark theme as base for dark mode
        if (theme === 'dark') {
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
            title: "Expert-Led Courses",
            description: "Learn from industry professionals and academic experts"
        },
        {
            icon: Users,
            title: "Community Learning",
            description: "Connect with learners across Africa"
        },
        {
            icon: Award,
            title: "Certificates",
            description: "Earn recognized certificates upon completion"
        },
        {
            icon: Globe,
            title: "Accessible Anywhere",
            description: "Learn from anywhere with mobile-friendly platform"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200"
                        >
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-foreground">
                21st Century Academy
              </span>
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex min-h-screen">
                {/* Left Side - Features */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-12 flex-col justify-center">
                    <div className="max-w-lg">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-foreground mb-4">
                                Welcome Back to Your
                                <span className="block text-primary-gradient">Learning Journey</span>
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Continue building skills for tomorrow with Africa's leading educational platform.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-foreground">1000+</div>
                                    <div className="text-sm text-muted-foreground">Students</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">75+</div>
                                    <div className="text-sm text-muted-foreground">Courses</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">95%</div>
                                    <div className="text-sm text-muted-foreground">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 lg:pt-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-foreground mb-2">
                                Sign In
                            </h2>
                            <p className="text-muted-foreground">
                                Welcome back! Please sign in to your account.
                            </p>
                        </div>

                        {/* Clerk Sign In Component */}
                        <div className="flex justify-center">
                            <SignIn
                                appearance={getClerkAppearance()}
                                redirectUrl="/dashboard"
                                signUpUrl="/sign-up"
                            />
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link
                                    href="/sign-up"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}