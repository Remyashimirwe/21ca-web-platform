'use client';

import React, { useState } from 'react';
import {
    Users,
    BookOpen,
    MapPin,
    TrendingUp,
    Heart,
    Award,
    Globe,
    Zap,
    Target,
    Calendar,
    Download,
    Share2,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PartnerDashboard = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('year');

    // Mock impact data
    const impactStats = {
        totalBeneficiaries: 3450,
        coursesDelivered: 75,
        communitiesReached: 28,
        certificatesIssued: 1250,
        employmentRate: 78,
        averageIncomeIncrease: 45,
        womenEmpowered: 1890,
        youthTrained: 2100
    };

    const fundingAllocation = [
        {
            category: "Course Development",
            amount: 125000,
            percentage: 35,
            description: "Creating quality educational content and materials",
            color: "bg-green-500"
        },
        {
            category: "Technology Infrastructure",
            amount: 89000,
            percentage: 25,
            description: "Platform development and maintenance",
            color: "bg-blue-500"
        },
        {
            category: "Instructor Training",
            amount: 71000,
            percentage: 20,
            description: "Building capacity of our teaching team",
            color: "bg-purple-500"
        },
        {
            category: "Student Support",
            amount: 53000,
            percentage: 15,
            description: "Scholarships and learning resources",
            color: "bg-yellow-500"
        },
        {
            category: "Operations",
            amount: 18000,
            percentage: 5,
            description: "Administrative and operational costs",
            color: "bg-gray-500"
        }
    ];

    const successStories = [
        {
            name: "Aisha Mukamana",
            location: "Kigali, Rwanda",
            program: "STEM Foundations",
            achievement: "Started her own tech consulting business",
            impact: "Now employs 8 people and trains rural teachers",
            image: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg"
        },
        {
            name: "Patrick Niyonzima",
            location: "Butare, Rwanda",
            program: "Green Entrepreneurship",
            achievement: "Launched solar panel installation company",
            impact: "Brought electricity to 150+ rural households",
            image: "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg"
        },
        {
            name: "Marie Claire Ingabire",
            location: "Musanze, Rwanda",
            program: "Digital Financial Literacy",
            achievement: "Became community financial educator",
            impact: "Trained 300+ people in mobile banking",
            image: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg"
        }
    ];

    const regionalImpact = [
        {
            region: "Kigali",
            students: 1250,
            courses: 28,
            completion: 85,
            employment: 82
        },
        {
            region: "Southern Province",
            students: 890,
            courses: 22,
            completion: 79,
            employment: 75
        },
        {
            region: "Northern Province",
            students: 680,
            courses: 15,
            completion: 82,
            employment: 78
        },
        {
            region: "Western Province",
            students: 630,
            courses: 10,
            completion: 77,
            employment: 73
        }
    ];

    const milestones = [
        {
            date: "Q4 2024",
            achievement: "Reached 3,000+ learners milestone",
            description: "Surpassed our annual target by 20%"
        },
        {
            date: "Q3 2024",
            achievement: "Launched mobile learning app",
            description: "Improved accessibility for rural communities"
        },
        {
            date: "Q2 2024",
            achievement: "Partnership with 10 local NGOs",
            description: "Expanded community outreach programs"
        },
        {
            date: "Q1 2024",
            achievement: "First 1,000 certificates issued",
            description: "Major milestone in learner achievement"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Public Header - No authentication required */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-b border-border">
                <div className="container mx-auto px-6 py-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Our Impact Dashboard
                        </h1>
                        <p className="text-xl text-muted-foreground mb-6">
                            Transparent reporting on how your support is transforming lives across Africa
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button className="gap-2">
                                <Download className="h-4 w-4" />
                                Download Report
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share Impact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Impact Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Lives Impacted
                            </CardTitle>
                            <Heart className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{impactStats.totalBeneficiaries.toLocaleString()}</div>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                Students empowered
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Communities Reached
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{impactStats.communitiesReached}</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Across Rwanda
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Employment Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{impactStats.employmentRate}%</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                Of graduates employed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Income Increase
                            </CardTitle>
                            <Zap className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{impactStats.averageIncomeIncrease}%</div>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                Average income boost
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Funding Allocation */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            Funding Allocation Transparency
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {fundingAllocation.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                                        <div className={`w-4 h-4 rounded ${item.color} flex-shrink-0`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-foreground">{item.category}</h4>
                                                <div className="text-right">
                                                    <div className="font-bold text-foreground">${item.amount.toLocaleString()}</div>
                                                    <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-64 h-64 relative">
                                    <div className="w-full h-full rounded-full border-8 border-muted/30 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary">$356K</div>
                                            <div className="text-sm text-muted-foreground">Total Investment</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Success Stories */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                Success Stories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {successStories.map((story, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300">
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{story.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{story.location}</p>
                                                </div>
                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {story.program}
                        </span>
                                            </div>
                                            <p className="text-sm font-medium text-foreground mb-1">{story.achievement}</p>
                                            <p className="text-sm text-muted-foreground">{story.impact}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Regional Impact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Regional Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {regionalImpact.map((region, index) => (
                                    <div key={index} className="p-4 bg-muted/30 rounded-xl">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-foreground">{region.region}</h4>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-primary">{region.students}</div>
                                                <div className="text-xs text-muted-foreground">Students</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="font-medium text-foreground">{region.courses}</div>
                                                <div className="text-muted-foreground">Courses</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{region.completion}%</div>
                                                <div className="text-muted-foreground">Completion</div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{region.employment}%</div>
                                                <div className="text-muted-foreground">Employment</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{impactStats.womenEmpowered.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Women Empowered</div>
                    </Card>

                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{impactStats.youthTrained.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Youth Trained</div>
                    </Card>

                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{impactStats.coursesDelivered}</div>
                        <div className="text-sm text-muted-foreground">Courses Delivered</div>
                    </Card>

                    <Card className="text-center p-6">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{impactStats.certificatesIssued.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Certificates Issued</div>
                    </Card>
                </div>

                {/* Timeline of Milestones */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Key Milestones & Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex gap-4 relative">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        Q{4-index}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-foreground">{milestone.achievement}</h4>
                                            <span className="text-sm text-muted-foreground">{milestone.date}</span>
                                        </div>
                                        <p className="text-muted-foreground">{milestone.description}</p>
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <div className="absolute left-6 top-12 w-0.5 h-6 bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-primary/20">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                            Join Us in Transforming Lives
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Your support enables us to reach more communities, develop better courses, and create lasting impact across Africa.
                            Together, we're building a brighter future through education.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="gap-2">
                                <Heart className="h-5 w-5" />
                                Partner With Us
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2">
                                <Download className="h-5 w-5" />
                                Download Full Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PartnerDashboard;