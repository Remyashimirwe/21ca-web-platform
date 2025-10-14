import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Zap,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  const benefits = [
    {
      icon: Target,
      title: "Personalized Learning Path",
      description: "Get customized course recommendations based on your goals",
    },
    {
      icon: Zap,
      title: "Interactive Learning",
      description: "Engage with hands-on projects and real-world applications",
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Keep access to your courses and materials forever",
    },
    {
      icon: Sparkles,
      title: "Community Support",
      description: "Join a vibrant community of learners and mentors",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header - No Navbar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="21st Century Academy Logo"
                  width={26}
                  height={26}
                  className="h-6 w-6"
                />
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
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-12 flex-col justify-center">
          <div className="max-w-lg">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 pt-5">
                Start Your
                <span className="block text-primary-gradient">
                  Transformation Today
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join thousands of learners building skills for the future with
                Africa's premier educational platform.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">Special Launch Offer</h3>
                <p className="text-sm opacity-90 mb-3">
                  Get 30% off your first course when you sign up this month!
                </p>
                <div className="text-xs opacity-75">
                  * Limited time offer. Terms apply.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-24 lg:pt-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-muted-foreground">
                Join our community and start learning today!
              </p>
            </div>

            {/* Clerk Sign Up Component */}
            <div className="flex justify-center">
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-primary hover:bg-primary/90 text-primary-foreground",
                    card: "shadow-2xl border border-border bg-card",
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton:
                      "border border-border bg-background hover:bg-muted text-foreground",
                    formFieldInput:
                      "border border-border bg-background text-foreground",
                    formFieldLabel: "text-foreground",
                    identityPreviewText: "text-foreground",
                    formResendCodeLink: "text-primary hover:text-primary/80",
                    footerActionLink: "text-primary hover:text-primary/80",
                    formFieldInputShowPasswordButton:
                      "text-muted-foreground hover:text-foreground",
                  },
                }}
                redirectUrl="/dashboard"
                signInUrl="/sign-in"
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-3">
                  Trusted by learners across Africa
                </div>
                <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Certified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Quality Content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
