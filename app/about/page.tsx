"use client";
import React, { useEffect, useState } from "react";
import {
    ArrowRight,
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    Crown,
    Globe,
    GraduationCap,
    Heart,
    Lightbulb,
    MapPin,
    Target,
    Users,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const AboutPage = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const coreValues = [
        {
            icon: Target,
            title: "Excellence",
            description: "We strive for the highest standards in education, ensuring every learner receives world-class instruction and support."
        },
        {
            icon: Heart,
            title: "Empowerment",
            description: "We believe in unlocking human potential through accessible, practical education that transforms lives and communities."
        },
        {
            icon: Globe,
            title: "Inclusion",
            description: "Education should be accessible to all. We break down barriers of geography, language, and economic status."
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "We embrace cutting-edge teaching methods and technology to create engaging, effective learning experiences."
        },
        {
            icon: Users,
            title: "Community",
            description: "Learning happens best in community. We foster collaboration, peer support, and lifelong connections."
        },
        {
            icon: Zap,
            title: "Impact",
            description: "Every course, every lesson is designed to create tangible, positive change in learners' lives and communities."
        }
    ];

    const milestones = [
        {
            year: "2020",
            title: "Foundation",
            description: "21st Century Academy was founded with a vision to democratize quality education across Africa."
        },
        {
            year: "2021",
            title: "First Programs Launch",
            description: "Launched our foundational STEM and Digital Literacy programs, reaching 200+ learners in the first year."
        },
        {
            year: "2022",
            title: "Regional Expansion",
            description: "Expanded beyond Rwanda to serve learners across East Africa with multilingual content."
        },
        {
            year: "2023",
            title: "Green Innovation Focus",
            description: "Introduced Green Entrepreneurship and Faith-Based Coaching programs, addressing sustainability and holistic development."
        },
        {
            year: "2024",
            title: "1000+ Graduates",
            description: "Celebrated our 1000th graduate and launched partnerships with leading African universities and NGOs."
        },
        {
            year: "2025",
            title: "Digital Transformation",
            description: "Launched our advanced learning platform with AI-assisted learning and comprehensive resource library."
        }
    ];

    const leadership = [
        {
            name: "Dr. Sarah Uwimana",
            role: "Founder & CEO",
            bio: "Former UNESCO education specialist with 15+ years developing STEM curricula for African contexts. PhD in Educational Technology from University of Cape Town.",
            image: "/api/placeholder/300/300",
            specialties: ["STEM Education", "Curriculum Development", "Educational Policy"]
        },
        {
            name: "Jean Claude Mugabo",
            role: "Head of Digital Innovation",
            bio: "FinTech entrepreneur and digital literacy advocate. Founded three successful startups in mobile payments and digital banking across East Africa.",
            image: "/api/placeholder/300/300",
            specialties: ["Financial Technology", "Digital Literacy", "Mobile Banking"]
        },
        {
            name: "Grace Nyirahabimana",
            role: "Director of Sustainability Programs",
            bio: "Environmental engineer and social entrepreneur. Led renewable energy projects impacting 50,000+ rural households across Rwanda and Uganda.",
            image: "/api/placeholder/300/300",
            specialties: ["Green Energy", "Social Entrepreneurship", "Rural Development"]
        },
        {
            name: "Emmanuel Nkurunziza",
            role: "Head of Community & Faith Programs",
            bio: "Ordained minister and community development specialist. 20+ years experience in faith-based education and community organizing.",
            image: "/api/placeholder/300/300",
            specialties: ["Community Development", "Faith-Based Education", "Leadership Coaching"]
        }
    ];

    const stats = [
        { number: "2,500+", label: "Active Learners", icon: Users },
        { number: "75+", label: "Courses Offered", icon: BookOpen },
        { number: "15", label: "Countries Served", icon: Globe },
        { number: "95%", label: "Completion Rate", icon: Award },
        { number: "50+", label: "Expert Instructors", icon: GraduationCap },
        { number: "12", label: "Languages Supported", icon: Heart }
    ];

    const partnerships = [
        {
            name: "University of Rwanda",
            type: "Academic Partner",
            description: "Collaborative research and curriculum development"
        },
        {
            name: "Rwanda Development Board",
            type: "Government Partner",
            description: "Supporting national digital literacy initiatives"
        },
        {
            name: "Mastercard Foundation",
            type: "Funding Partner",
            description: "Youth empowerment and skills development programs"
        },
        {
            name: "USAID Rwanda",
            type: "Development Partner",
            description: "Capacity building and entrepreneurship support"
        }
    ];

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[600px] overflow-hidden mt-16">
                <div
                    className="w-full h-full bg-gradient-to-r from-slate-900/80 to-slate-800/60 flex items-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(24, 29, 56, 0.8), rgba(24, 29, 56, 0.8)), url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=60)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl">
                            <h5 className="text-primary-gradient font-semibold text-xl mb-6 animate-fade-in-up">
                                About Us
                            </h5>
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-8 animate-fade-in-up animation-delay-200">
                                Building Africa&#39;s Future Through Transformative Education
                            </h1>
                            <p className="text-xl text-gray-200 mb-8 leading-relaxed animate-fade-in-up animation-delay-400">
                                We&#39;re more than an academy – we&#39;re a movement. Empowering learners across Africa with cutting-edge skills,
                                practical knowledge, and the confidence to shape tomorrow&#39;s world.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
                                <Link href={"/pages/impact-stories"}>
                                <Button
                                    size="lg"
                                    className="bg-primary-gradient hover:opacity-90 hover:scale-105 transition-all duration-200 text-white border-0 px-8 py-4"
                                >
                                    Our Impact
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="bg-white/10 border-white text-white hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-200 px-8 py-4"
                                >
                                    Meet Our Team
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                Our Purpose
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Mission & Vision
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        To democratize access to quality education by providing practical, relevant, and transformative learning experiences
                                        that bridge traditional knowledge with 21st-century skills, empowering African learners to thrive in a global economy.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        A future where every African has access to world-class education that unlocks their potential,
                                        drives innovation, and creates sustainable solutions for local and global challenges.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60"
                                    alt="Students collaborating"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            What Drives Us
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            These principles guide everything we do, from course design to community engagement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-card rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50"
                            >
                                <div className="mb-6">
                                    <value.icon
                                        size={48}
                                        className="mx-auto transition-all duration-300 group-hover:scale-110 text-primary group-hover:text-primary"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


{/* Our Story Timeline */}
<section className="py-20 bg-background">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
        Our Journey
      </div>
      <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Our Story
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        From a small vision to a continental movement – here’s how we’ve grown and evolved
      </p>
    </div>

    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary to-primary/20 hidden lg:block"></div>

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            {/* Content */}
            <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-1'} relative`}>
              <motion.div
                className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`flex items-center mb-4 ${index % 2 === 1 ? 'lg:justify-end' : 'justify-start'}`}>
                  <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {milestone.description}
                </p>
              </motion.div>

              {/* Timeline dot */}
              <motion.div
                className={`hidden lg:block absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg ${index % 2 === 1 ? '-left-2' : '-right-2'}`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                viewport={{ once: true }}
              ></motion.div>
            </div>

            {/* Visual element */}
            <motion.div
              className={`${index % 2 === 1 ? 'lg:col-start-2' : 'lg:col-start-2'} hidden lg:block`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl"></div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

            {/* Leadership Team */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Leadership
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Meet Our Leadership Team
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Visionary leaders with deep expertise in education, technology, and African development
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {leadership.map((leader, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={leader.image}
                                            alt={leader.name}
                                            className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="md:w-2/3">
                                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                            {leader.name}
                                        </h3>
                                        <h4 className="text-lg text-primary font-semibold mb-4">
                                            {leader.role}
                                        </h4>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            {leader.bio}
                                        </p>

                                        <div className="space-y-2">
                                            <h5 className="font-semibold text-foreground text-sm">Specialties:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {leader.specialties.map((specialty, sIndex) => (
                                                    <span
                                                        key={sIndex}
                                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Real metrics that demonstrate our commitment to educational excellence and community impact
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <stat.icon className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <div className="text-3xl lg:text-4xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Approach & Methodology */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&auto=format&fit=crop&q=60"
                                    alt="Students using technology"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            </div>

                            {/* Floating feature card */}
                            <div className="absolute -bottom-6 -left-6 bg-card border border-border p-6 rounded-xl shadow-lg">
                                <div className="text-center">
                                    <Crown className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <div className="text-lg font-bold text-foreground">Premium Quality</div>
                                    <div className="text-sm text-muted-foreground">Global Standards</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                Our Approach
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                How We Transform Lives
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Contextual Learning</h4>
                                        <p className="text-muted-foreground">Every course is designed for the African context, addressing real challenges and opportunities in our communities.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Practical Application</h4>
                                        <p className="text-muted-foreground">Hands-on projects and real-world case studies ensure learners can immediately apply their new skills.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Community-Centered</h4>
                                        <p className="text-muted-foreground">Learning happens in supportive communities where peers and mentors provide ongoing encouragement and guidance.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">Technology-Enhanced</h4>
                                        <p className="text-muted-foreground">We leverage technology to make learning accessible, engaging, and scalable while remaining offline-friendly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnerships */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Collaboration
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Strategic Partnerships
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Working together with leading organizations to maximize our educational impact
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {partnerships.map((partner, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                        <Globe className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                            {partner.name}
                                        </h3>
                                        <div className="text-primary font-semibold text-sm mb-2">
                                            {partner.type}
                                        </div>
                                        <p className="text-muted-foreground">
                                            {partner.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location & Contact Info */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                Find Us
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Based in Kigali, Serving Africa
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Headquartered in Rwanda&#39;s vibrant capital, we&#39;ve created a hub for educational innovation
                                that extends across the continent and beyond.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Headquarters</h4>
                                        <p className="text-muted-foreground">Kigali Innovation City<br />KG 17 Ave, Kigali, Rwanda</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Global Reach</h4>
                                        <p className="text-muted-foreground">Serving learners across 15 countries in Sub-Saharan Africa and the diaspora</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Support Hours</h4>
                                        <p className="text-muted-foreground">Monday-Friday: 8:00 AM - 6:00 PM CAT<br />Weekend support available</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=600&auto=format&fit=crop&q=60"
                                    alt="Kigali skyline"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Join Our Community?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            Become part of a growing movement of learners, educators, and change-makers who are
                            building skills for tomorrow. Your transformation starts today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 px-8 py-4"
                            >
                                Explore Our Programs
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-white/10 border-white text-white hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-200 px-8 py-4"
                            >
                                Get In Touch
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                                    Stay Connected with 21CA
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Get updates on new programs, success stories from our community,
                                    and insights on education and innovation in Africa.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <Button className="px-8 hover:scale-105 transition-transform duration-200">
                                        Subscribe
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Join 5,000+ subscribers. Unsubscribe anytime. Privacy policy applies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;