"use client";
import React, { useState } from "react";
import {
    Check,
    X,
    Star,
    Crown,
    Zap,
    Shield,
    Users,
    BookOpen,
    Award,
    Clock,
    Globe,
    Heart,
    ArrowRight,
    Phone,
    MessageCircle,
    Mail,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [selectedPlan, setSelectedPlan] = useState(null);

    const pricingPlans = [
        {
            name: "Explorer",
            subtitle: "Perfect for beginners",
            monthlyPrice: 0,
            annualPrice: 0,
            color: "green",
            icon: BookOpen,
            popular: false,
            description: "Start your learning journey with essential courses and basic support",
            features: [
                "Access to 5 foundational courses",
                "Basic video lessons",
                "Community forum access",
                "Mobile app access",
                "Course completion certificates",
                "Email support"
            ],
            notIncluded: [
                "Live sessions",
                "Personalized mentoring",
                "Advanced projects",
                "Career guidance",
                "Priority support"
            ]
        },
        {
            name: "Innovator",
            subtitle: "Most popular choice",
            monthlyPrice: 49,
            annualPrice: 39,
            color: "blue",
            icon: Zap,
            popular: true,
            description: "Comprehensive learning experience with live sessions and project-based learning",
            features: [
                "Access to 25+ premium courses",
                "Live interactive sessions",
                "Hands-on projects and labs",
                "Downloadable resources",
                "Progress tracking dashboard",
                "Community networking",
                "Email & chat support",
                "Monthly skill assessments",
                "Industry-recognized certificates"
            ],
            notIncluded: [
                "1-on-1 mentoring",
                "Career placement assistance",
                "Priority support"
            ]
        },
        {
            name: "Visionary",
            subtitle: "For serious learners",
            monthlyPrice: 99,
            annualPrice: 79,
            color: "purple",
            icon: Crown,
            popular: false,
            description: "Premium experience with personalized mentoring and career support",
            features: [
                "Access to ALL courses (50+)",
                "Live sessions & workshops",
                "1-on-1 mentoring sessions",
                "Personalized learning paths",
                "Real-world capstone projects",
                "Career guidance & placement",
                "Priority support (24/7)",
                "Exclusive masterclasses",
                "LinkedIn profile optimization",
                "Job referral network",
                "Alumni community access"
            ],
            notIncluded: []
        },
        {
            name: "Enterprise",
            subtitle: "For organizations",
            monthlyPrice: "Custom",
            annualPrice: "Custom",
            color: "gold",
            icon: Shield,
            popular: false,
            description: "Tailored solutions for schools, NGOs, and corporate training programs",
            features: [
                "Unlimited course access",
                "Custom course development",
                "Dedicated account manager",
                "Bulk user management",
                "Advanced analytics & reporting",
                "White-label solutions",
                "On-site training options",
                "API integration",
                "Custom certification",
                "Priority implementation",
                "Dedicated support team"
            ],
            notIncluded: []
        }
    ];

    const additionalServices = [
        {
            name: "Career Coaching",
            price: "$75/session",
            description: "One-on-one career guidance sessions",
            icon: Users
        },
        {
            name: "Portfolio Review",
            price: "$45/review",
            description: "Professional review of your project portfolio",
            icon: Award
        },
        {
            name: "Interview Prep",
            price: "$60/session",
            description: "Mock interviews and feedback sessions",
            icon: MessageCircle
        },
        {
            name: "Technical Mentorship",
            price: "$85/hour",
            description: "Expert guidance on specific technical challenges",
            icon: Zap
        }
    ];

    const faqData = [
        {
            question: "Can I switch between plans?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes! All paid plans come with a 7-day free trial. You can cancel anytime during the trial period without being charged."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and mobile money payments (MTN Mobile Money, Airtel Money)."
        },
        {
            question: "Are certificates internationally recognized?",
            answer: "Yes, our certificates are recognized by major employers and educational institutions across Africa and internationally."
        },
        {
            question: "Do you offer student discounts?",
            answer: "Yes, we offer a 30% discount for full-time students. Contact our support team with your student ID for verification."
        },
        {
            question: "What happens if I cancel my subscription?",
            answer: "You'll continue to have access to your current plan features until the end of your billing period. After that, you'll be moved to the free Explorer plan."
        }
    ];

    const getColorClasses = (color, variant = 'default') => {
        const colors = {
            green: {
                default: "border-green-500",
                bg: "bg-green-50 dark:bg-green-900/20",
                text: "text-green-600 dark:text-green-400",
                button: "bg-green-500 hover:bg-green-600",
                gradient: "from-green-400 to-green-600"
            },
            blue: {
                default: "border-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                text: "text-blue-600 dark:text-blue-400",
                button: "bg-blue-500 hover:bg-blue-600",
                gradient: "from-blue-400 to-blue-600"
            },
            purple: {
                default: "border-purple-500",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                text: "text-purple-600 dark:text-purple-400",
                button: "bg-purple-500 hover:bg-purple-600",
                gradient: "from-purple-400 to-purple-600"
            },
            gold: {
                default: "border-yellow-500",
                bg: "bg-yellow-50 dark:bg-yellow-900/20",
                text: "text-yellow-600 dark:text-yellow-500",
                button: "bg-yellow-500 hover:bg-yellow-600 text-black",
                gradient: "from-yellow-400 to-yellow-600"
            }
        };
        return colors[color]?.[variant] || colors.green[variant];
    };

    const formatPrice = (price) => {
        if (typeof price === 'string') return price;
        return price === 0 ? 'Free' : `$${price}`;
    };

    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Flexible Pricing Plans
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Invest in Your <span className="text-primary-gradient">Future</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Choose the perfect plan to accelerate your learning journey. From free access to premium mentoring,
                            we have options for every learner and budget.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center bg-muted rounded-lg p-1 mb-12">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                                    billingCycle === "monthly"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle("annual")}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    billingCycle === "annual"
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>Annual</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                                    Save 20%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                                    plan.popular
                                        ? `border-2 ${getColorClasses(plan.color)} transform hover:-translate-y-2 scale-105`
                                        : "border border-border hover:-translate-y-1"
                                }`}
                            >
                                {plan.popular && (
                                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${getColorClasses(plan.color, 'gradient')} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                                        Most Popular
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getColorClasses(plan.color, 'bg')} flex items-center justify-center`}>
                                            <plan.icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                        <p className="text-muted-foreground text-sm mb-4">{plan.subtitle}</p>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-4xl font-bold text-foreground">
                                                    {formatPrice(billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice)}
                                                </span>
                                                {typeof plan.monthlyPrice === 'number' && plan.monthlyPrice > 0 && (
                                                    <span className="text-muted-foreground ml-2">
                                                        /{billingCycle === "monthly" ? "month" : "year"}
                                                    </span>
                                                )}
                                            </div>
                                            {billingCycle === "annual" && typeof plan.monthlyPrice === 'number' && plan.monthlyPrice > 0 && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Billed annually (${plan.annualPrice * 12}/year)
                                                </p>
                                            )}
                                        </div>

                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start space-x-3">
                                                <CheckCircle className={`w-5 h-5 mt-0.5 ${getColorClasses(plan.color, 'text')} flex-shrink-0`} />
                                                <span className="text-foreground text-sm leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start space-x-3 opacity-50">
                                                <X className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                                                <span className="text-muted-foreground text-sm leading-relaxed line-through">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        className={`w-full ${
                                            plan.popular
                                                ? `${getColorClasses(plan.color, 'button')} text-white hover:scale-105 hover:brightness-110`
                                                : "bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105 hover:shadow-xl"
                                        } transition-all duration-300 shadow-md hover:shadow-lg`}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        {plan.monthlyPrice === 0 ? "Get Started Free" :
                                            plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    {plan.monthlyPrice > 0 && plan.name !== "Enterprise" && (
                                        <p className="text-xs text-muted-foreground text-center mt-3">
                                            7-day free trial • Cancel anytime
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Services */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Additional Services
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Enhance your learning experience with our personalized add-on services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {additionalServices.map((service, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <service.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground mb-2">{service.name}</h4>
                                    <p className="text-2xl font-bold text-primary mb-3">{service.price}</p>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        {service.description}
                                    </p>
                                    <Button variant="outline" size="sm" className="w-full hover:scale-105 transition-transform duration-200">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Compare All Features
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            See exactly what's included in each plan
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                            <table className="w-full bg-card rounded-2xl shadow-lg overflow-hidden">
                                <thead>
                                <tr className="bg-muted/50">
                                    <th className="text-left py-6 px-6 font-semibold text-foreground">Features</th>
                                    {pricingPlans.map((plan, index) => (
                                        <th key={index} className="text-center py-6 px-4 font-semibold text-foreground min-w-[140px]">
                                            <div className="flex flex-col items-center">
                                                <plan.icon className={`w-6 h-6 mb-2 ${getColorClasses(plan.color, 'text')}`} />
                                                {plan.name}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                {[
                                    "Course Access",
                                    "Live Sessions",
                                    "Projects & Labs",
                                    "Community Access",
                                    "Certificates",
                                    "1-on-1 Mentoring",
                                    "Career Support",
                                    "Priority Support"
                                ].map((feature, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-muted/20 transition-colors duration-200">
                                        <td className="py-4 px-6 font-medium text-foreground">{feature}</td>
                                        {pricingPlans.map((plan, planIndex) => {
                                            const hasFeature =
                                                (feature === "Course Access" && true) ||
                                                (feature === "Live Sessions" && planIndex >= 1) ||
                                                (feature === "Projects & Labs" && planIndex >= 1) ||
                                                (feature === "Community Access" && true) ||
                                                (feature === "Certificates" && true) ||
                                                (feature === "1-on-1 Mentoring" && planIndex >= 2) ||
                                                (feature === "Career Support" && planIndex >= 2) ||
                                                (feature === "Priority Support" && planIndex >= 2);

                                            return (
                                                <td key={planIndex} className="py-4 px-4 text-center">
                                                    {hasFeature ? (
                                                        <Check className={`w-5 h-5 mx-auto ${getColorClasses(plan.color, 'text')}`} />
                                                    ) : (
                                                        <X className="w-5 h-5 mx-auto text-muted-foreground" />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Got questions? We have answers.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-4">
                            {faqData.map((faq, index) => (
                                <div key={index} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                                    <details className="group">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors duration-200">
                                            <h4 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h4>
                                            <div className="flex-shrink-0">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-open:rotate-45 transition-transform duration-200">
                                                    <div className="w-3 h-0.5 bg-primary absolute"></div>
                                                    <div className="w-0.5 h-3 bg-primary absolute"></div>
                                                </div>
                                            </div>
                                        </summary>
                                        <div className="px-6 pb-6">
                                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: Users, number: "10,000+", label: "Active Learners" },
                            { icon: Star, number: "4.9/5", label: "Student Rating" },
                            { icon: Award, number: "98%", label: "Course Completion" },
                            { icon: Globe, number: "25+", label: "Countries Served" }
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            Join thousands of learners who are already transforming their careers with 21st Century Academy.
                            Start your free trial today - no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-200"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Talk to Sales
                            </Button>
                        </div>
                        <p className="text-sm text-gray-400 mt-6">
                            Questions? Contact us at{" "}
                            <a href="mailto:hello@21ca.rw" className="text-primary hover:underline">
                                hello@21ca.rw
                            </a>{" "}
                            or{" "}
                            <a href="tel:+250788123456" className="text-primary hover:underline">
                                +250 788 123 456
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;