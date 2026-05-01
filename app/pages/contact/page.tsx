"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    Globe,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    User,
    Users,
    Building,
    BookOpen,
    HelpCircle,
    Video, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            description: "Speak directly with our team",
            info: "+250 788 123 456",
            subInfo: "Mon-Fri, 8AM-6PM (CAT)",
            action: "Call Now",
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            icon: Mail,
            title: "Email Us",
            description: "Send us your questions",
            info: "hello@21stcenturyacademy.rw",
            subInfo: "We respond within 24 hours",
            action: "Send Email",
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Get instant support",
            info: "Available 24/7",
            subInfo: "Average response: 2 minutes",
            action: "Start Chat",
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            icon: MapPin,
            title: "Visit Us",
            description: "Come see our campus",
            info: "Kigali Innovation Hub",
            subInfo: "KN 3 Rd, Kigali, Rwanda",
            action: "Get Directions",
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
        },
    ];

    const departments = [
        {
            name: "Admissions",
            email: "admissions@21stcenturyacademy.rw",
            phone: "+250 788 123 457",
            description: "Course enrollment and academic inquiries",
        },
        {
            name: "Technical Support",
            email: "support@21stcenturyacademy.rw",
            phone: "+250 788 123 458",
            description: "Platform issues and technical assistance",
        },
        {
            name: "Student Services",
            email: "students@21stcenturyacademy.rw",
            phone: "+250 788 123 459",
            description: "Academic support and student resources",
        },
        {
            name: "Partnerships",
            email: "partnerships@21stcenturyacademy.rw",
            phone: "+250 788 123 460",
            description: "Corporate training and collaborations",
        },
    ];

    const faq = [
        {
            question: "How do I enroll in a course?",
            answer: "You can enroll by browsing our course catalog, selecting your desired course, and clicking 'Enroll Now'. Create an account if you haven't already, complete payment, and you'll have immediate access.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept Mobile Money (MTN, Airtel), Visa/Mastercard, bank transfers, and cash payments at our campus. We also offer installment plans for longer programs.",
        },
        {
            question: "Do you offer certificates?",
            answer: "Yes! We provide certificates of completion for all our courses. Some programs also offer industry-recognized certifications from our partner organizations.",
        },
        {
            question: "Can I study part-time?",
            answer: "Absolutely! Most of our courses are designed for flexible learning. You can study at your own pace and access materials 24/7 from any device.",
        },
    ];

    const offices = [
        {
            city: "Kigali",
            address: "Kigali Innovation Hub, KN 3 Rd",
            phone: "+250 788 123 456",
            email: "kigali@21stcenturyacademy.rw",
            hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-1PM",
            isMain: true,
        },
        {
            city: "Musanze",
            address: "Musanze Business Center, Ruhengeri",
            phone: "+250 788 123 461",
            email: "musanze@21stcenturyacademy.rw",
            hours: "Mon-Fri: 8AM-5PM",
            isMain: false,
        },
        {
            city: "Huye",
            address: "University District, Butare",
            phone: "+250 788 123 462",
            email: "huye@21stcenturyacademy.rw",
            hours: "Mon-Fri: 8AM-5PM",
            isMain: false,
        },
    ];

    const handleInputChange = (e: { target: { name: never; value: never; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            category: "",
            message: "",
        });
    };

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
                            Get in{" "}
                            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                Touch
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                            Ready to transform your future? We&#39;re here to help you every step of the way.
                            Reach out and let&#39;s start your learning journey together.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Choose Your Preferred Way
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Multiple ways to connect with us - pick what works best for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group text-center"
                            >
                                <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <method.icon size={24} className={method.color} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {method.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    {method.description}
                                </p>
                                <div className="space-y-1 mb-6">
                                    <div className="font-medium text-foreground">{method.info}</div>
                                    <div className="text-sm text-muted-foreground">{method.subInfo}</div>
                                </div>
                                <Button
                                    className="w-full hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    {method.action}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Form */}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                                Send Us a Message
                            </h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Have specific questions or need personalized guidance? Fill out the form
                                below and we&#39;ll get back to you within 24 hours.
                            </p>

                            {submitted ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                                        Message Sent Successfully!
                                    </h3>
                                    <p className="text-green-700 dark:text-green-300">
                                        Thank you for reaching out. We&#39;ll respond to your inquiry within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="+250 xxx xxx xxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Inquiry Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="admissions">Course Admissions</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="partnerships">Partnerships</option>
                                                <option value="general">General Inquiry</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Brief subject line"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                            placeholder="Tell us how we can help you..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full hover:scale-105 transition-transform duration-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={16} className="ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Quick Info */}
                        <div className="space-y-8">
                            <div className="bg-card rounded-2xl p-8 border border-border/50">
                                <h3 className="text-xl font-bold text-foreground mb-6">
                                    Department Contacts
                                </h3>
                                <div className="space-y-6">
                                    {departments.map((dept, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Building size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{dept.name}</h4>
                                                <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Mail size={12} className="mr-2" />
                                                        {dept.email}
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Phone size={12} className="mr-2" />
                                                        {dept.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl p-8 border border-border/50">
                                <h3 className="text-xl font-bold text-foreground mb-6">
                                    Quick FAQ
                                </h3>
                                <div className="space-y-4">
                                    {faq.slice(0, 3).map((item, index) => (
                                        <div key={index} className="border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                                            <h4 className="font-medium text-foreground mb-2">{item.question}</h4>
                                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-6">
                                    View All FAQ
                                    <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Our Locations
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Visit us at any of our campus locations across Rwanda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offices.map((office, index) => (
                            <div
                                key={index}
                                className={`bg-card rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                                    office.isMain
                                        ? "border-primary/50 ring-2 ring-primary/20"
                                        : "border-border/50 hover:border-primary/50"
                                }`}
                            >
                                {office.isMain && (
                                    <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold mb-4">
                                        Main Campus
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-foreground mb-2">{office.city}</h3>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-start space-x-2">
                                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>{office.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone size={16} className="flex-shrink-0" />
                                        <span>{office.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail size={16} className="flex-shrink-0" />
                                        <span>{office.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock size={16} className="flex-shrink-0" />
                                        <span>{office.hours}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-6 hover:scale-105 transition-transform duration-200">
                                    Get Directions
                                    <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                        <div className="aspect-[16/10] bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin size={48} className="text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">Interactive Map</h3>
                                <p className="text-muted-foreground mb-4">
                                    Find us easily with our interactive campus map
                                </p>
                                <Button>
                                    Open Map
                                    <ExternalLink size={14} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Don&#39;t wait - your transformation begins with a single step.
                            Get in touch today and let&#39;s build your future together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                Schedule a Call
                                <Video className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-all duration-200"
                            >
                                Browse Courses
                                <BookOpen className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;