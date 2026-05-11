"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    ExternalLink,
    Globe,
    HelpCircle,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Play,
    Search,
    Star,
    User,
    Users,
    Video,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SupportPage = () => {
    type HelpTabKey = "getting-started" | "technical" | "account";
    
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<HelpTabKey>("getting-started");

    useEffect(() => {
        setMounted(true);
    }, []);

    const supportCategories = [
        { name: "All", count: 45 },
        { name: "Getting Started", count: 12 },
        { name: "Technical Issues", count: 8 },
        { name: "Account & Billing", count: 10 },
        { name: "Course Content", count: 7 },
        { name: "Certificates", count: 5 },
        { name: "Mobile App", count: 3 },
    ];

    const faqData = [
        {
            category: "Getting Started",
            question: "How do I enroll in a course?",
            answer: "To enroll in a course, browse our course catalog, select your desired course, and click 'Enroll Now'. You'll need to create an account if you haven't already. After payment, you'll have immediate access to all course materials.",
        },
        {
            category: "Getting Started",
            question: "Can I access courses on mobile devices?",
            answer: "Yes! Our platform is fully mobile-responsive. You can access courses through your mobile browser or download our dedicated mobile app for iOS and Android devices for the best learning experience on-the-go.",
        },
        {
            category: "Technical Issues",
            question: "Videos won't play or are buffering constantly",
            answer: "This is usually due to internet connectivity. Try refreshing the page, clearing your browser cache, or switching to a different browser. For persistent issues, try downloading the video for offline viewing or contact our technical support.",
        },
        {
            category: "Account & Billing",
            question: "How do I update my payment information?",
            answer: "Go to your Account Settings > Billing Information. You can update your payment method, view billing history, and manage subscriptions. Changes take effect immediately for future payments.",
        },
        {
            category: "Course Content",
            question: "How long do I have access to course materials?",
            answer: "Once you enroll in a course, you have lifetime access to all course materials, including updates and new content added to the course. You can learn at your own pace without time restrictions.",
        },
        {
            category: "Certificates",
            question: "How do I receive my certificate of completion?",
            answer: "Certificates are automatically generated once you complete all required course modules and pass any required assessments with a minimum score of 70%. You can download your certificate from the Course Dashboard.",
        },
    ];

    const quickLinks = [
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Step-by-step video guides for common tasks",
            link: "#",
            color: "text-blue-500",
        },
        {
            icon: Download,
            title: "Student Handbook",
            description: "Complete guide to using our platform",
            link: "#",
            color: "text-green-500",
        },
        {
            icon: Users,
            title: "Community Forum",
            description: "Connect with other learners and instructors",
            link: "#",
            color: "text-purple-500",
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Get instant help from our support team",
            link: "#",
            color: "text-orange-500",
        },
    ];

    const contactMethods = [
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Available 24/7 for instant support",
            action: "Start Chat",
            available: true,
        },
        {
            icon: Mail,
            title: "Email Support",
            description: "support@21stcenturyacademy.rw",
            action: "Send Email",
            available: true,
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "+250 788 123 456",
            action: "Call Now",
            available: true,
        },
        {
            icon: MapPin,
            title: "Visit Us",
            description: "Kigali Innovation Hub, KN 3 Rd, Kigali",
            action: "Get Directions",
            available: true,
        },
    ];

    const helpTopics: Record<HelpTabKey, { title: string; duration: string; type: string }[]> = {
        "getting-started": [
            { title: "Creating Your Account", duration: "2 min read", type: "article" },
            { title: "Navigating the Dashboard", duration: "3 min read", type: "article" },
            { title: "How to Enroll in Courses", duration: "5 min watch", type: "video" },
            { title: "Setting Up Your Profile", duration: "2 min read", type: "article" },
        ],
        "technical": [
            { title: "System Requirements", duration: "1 min read", type: "article" },
            { title: "Troubleshooting Video Issues", duration: "4 min watch", type: "video" },
            { title: "Browser Compatibility", duration: "2 min read", type: "article" },
            { title: "Download Course Materials", duration: "3 min read", type: "article" },
        ],
        "account": [
            { title: "Managing Your Subscription", duration: "3 min read", type: "article" },
            { title: "Payment Methods", duration: "2 min read", type: "article" },
            { title: "Refund Policy", duration: "4 min read", type: "article" },
            { title: "Account Security", duration: "3 min read", type: "article" },
        ],
    };

    const filteredFaqs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-24 mt-16">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            How can we{" "}
                            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">help you?</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                            Find answers, get support, and make the most of your learning journey
                            with 21st Century Academy
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search for help articles, guides, or tutorials..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                                <div className="text-muted-foreground">Support Available</div>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                                <div className="text-3xl font-bold text-primary mb-2">2hrs</div>
                                <div className="text-muted-foreground">Average Response Time</div>
                            </div>
                            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                                <div className="text-muted-foreground">Issue Resolution Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Popular Help Topics
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get quick access to the most commonly requested help resources
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickLinks.map((link, index) => (
                            <div
                                key={index}
                                className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="mb-4">
                                    <link.icon
                                        size={40}
                                        className={`${link.color} group-hover:scale-110 transition-transform duration-300`}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                    {link.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {link.description}
                                </p>
                                <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                                    Learn more
                                    <ArrowRight size={14} className="ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Help Categories & Articles */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Categories Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Browse by Category
                                </h3>
                                <div className="space-y-2">
                                    {supportCategories.map((category, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedCategory(category.name)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 hover:bg-muted ${
                                                selectedCategory === category.name
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <span className="font-medium">{category.name}</span>
                                            <span className="text-xs bg-background/20 px-2 py-1 rounded-full">
                                                {category.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Help Articles Tabs */}
                        <div className="lg:col-span-3">
                            <div className="bg-card rounded-2xl border border-border/50">
                                {/* Tab Navigation */}
                                <div className="border-b border-border/50">
                                    <div className="flex space-x-1 p-1 m-4 bg-muted rounded-lg">
                                        {[
                                            { id: "getting-started", label: "Getting Started" },
                                            { id: "technical", label: "Technical" },
                                            { id: "account", label: "Account" },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as HelpTabKey)}
                                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    activeTab === tab.id
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {helpTopics[activeTab]?.map((topic, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        {topic.type === "video" ? (
                                                            <Play size={16} className="text-primary" />
                                                        ) : (
                                                            <BookOpen size={16} className="text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                                                            {topic.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {topic.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight
                                                    size={16}
                                                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Quick answers to the most common questions about our platform
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-card border border-border/50 rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
                                    >
                                        <div>
                                            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-2">
                                                {faq.category}
                                            </span>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`text-muted-foreground transition-transform duration-200 ${
                                                expandedFaq === index ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ${
                                            expandedFaq === index ? "pb-6 max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="pt-4 border-t border-border/30">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredFaqs.length === 0 && (
                            <div className="text-center py-12">
                                <HelpCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    No results found
                                </h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search terms or browse different categories
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Still Need Help?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our support team is here to help you succeed. Choose your preferred way to get in touch
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                                    <method.icon size={24} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-muted-foreground mb-4 text-sm">
                                    {method.description}
                                </p>
                                <Button
                                    className="w-full hover:scale-105 transition-transform duration-200"
                                    variant={method.available ? "default" : "outline"}
                                    disabled={!method.available}
                                >
                                    {method.action}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            Join Our Learning Community
                        </h2>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Connect with fellow learners, share experiences, and get peer support
                            in our vibrant community forums
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                Join Community
                                <Users className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-200"
                            >
                                Browse Discussions
                                <MessageCircle className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default SupportPage;