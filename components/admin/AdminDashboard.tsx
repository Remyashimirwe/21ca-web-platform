"use client";
import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from "recharts";
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    DollarSign,
    Clock,
    Star,
    UserCheck,
    MessageSquare,
    Settings,
    Plus,
    Eye,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Bell,
    Calendar,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sample data for charts
    const enrollmentData = [
        { month: "Jan", students: 120 },
        { month: "Feb", students: 180 },
        { month: "Mar", students: 250 },
        { month: "Apr", students: 320 },
        { month: "May", students: 410 },
        { month: "Jun", students: 480 },
    ];

    const coursePopularityData = [
        { name: "STEM Education", value: 35, color: "#10B981" },
        { name: "Digital Literacy", value: 25, color: "#3B82F6" },
        { name: "Green Entrepreneurship", value: 25, color: "#F59E0B" },
        { name: "Faith-Based Coaching", value: 15, color: "#EF4444" },
    ];

    const revenueData = [
        { month: "Jan", revenue: 5400 },
        { month: "Feb", revenue: 7200 },
        { month: "Mar", revenue: 9800 },
        { month: "Apr", revenue: 12400 },
        { month: "May", revenue: 15600 },
        { month: "Jun", revenue: 18900 },
    ];

    const recentStudents = [
        { id: 1, name: "Aisha Mukamana", course: "STEM Foundations", enrolled: "2 hours ago", status: "active" },
        { id: 2, name: "Patrick Niyonzima", course: "Green Entrepreneurship", enrolled: "4 hours ago", status: "active" },
        { id: 3, name: "Marie Claire Ingabire", course: "Digital Literacy", enrolled: "6 hours ago", status: "pending" },
        { id: 4, name: "Jean Baptiste Rwema", course: "Faith-Based Coaching", enrolled: "1 day ago", status: "active" },
        { id: 5, name: "Grace Uwimana", course: "STEM Foundations", enrolled: "2 days ago", status: "completed" },
    ];

    const courses = [
        { id: 1, title: "STEM Foundations for Young Innovators", students: 156, revenue: "$7,644", rating: 4.9, status: "Published" },
        { id: 2, title: "Digital Financial Literacy Essentials", students: 203, revenue: "$7,917", rating: 4.8, status: "Published" },
        { id: 3, title: "Green Entrepreneurship Bootcamp", students: 98, revenue: "$8,722", rating: 4.9, status: "Published" },
        { id: 4, title: "Faith-Based Leadership", students: 67, revenue: "$3,350", rating: 4.7, status: "Draft" },
    ];

    const stats = [
        {
            title: "Total Students",
            value: "1,234",
            change: "+12%",
            changeType: "positive",
            icon: Users,
            color: "bg-blue-500"
        },
        {
            title: "Active Courses",
            value: "75",
            change: "+5%",
            changeType: "positive",
            icon: BookOpen,
            color: "bg-green-500"
        },
        {
            title: "Total Revenue",
            value: "$89,420",
            change: "+18%",
            changeType: "positive",
            icon: DollarSign,
            color: "bg-purple-500"
        },
        {
            title: "Completion Rate",
            value: "92%",
            change: "+3%",
            changeType: "positive",
            icon: Award,
            color: "bg-orange-500"
        },
    ];

    const sidebarItems = [
        { id: "overview", label: "Overview", icon: BarChart },
        { id: "students", label: "Students", icon: Users },
        { id: "courses", label: "Courses", icon: BookOpen },
        { id: "instructors", label: "Instructors", icon: GraduationCap },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                stat.changeType === 'positive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                {stat.change}
              </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                        <p className="text-muted-foreground text-sm">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Enrollment Chart */}
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Student Enrollment</h3>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={enrollmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="students" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Course Popularity */}
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Course Popularity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={coursePopularityData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {coursePopularityData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Revenue Growth</h3>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm">6M</Button>
                        <Button variant="outline" size="sm">1Y</Button>
                        <Button size="sm">All</Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Students Table */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Recent Enrollments</h3>
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Course</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Enrolled</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentStudents.map((student) => (
                            <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium text-foreground">{student.name}</td>
                                <td className="py-3 px-4 text-muted-foreground">{student.course}</td>
                                <td className="py-3 px-4 text-muted-foreground">{student.enrolled}</td>
                                <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' ? 'bg-green-100 text-green-600' :
                            student.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                    }`}>
                      {student.status}
                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Course Management</h2>
                <Button className="hover:scale-105 transition-transform duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                </Button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Course</th>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Students</th>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Revenue</th>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Rating</th>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-6">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{course.title}</h4>
                                        <p className="text-sm text-muted-foreground">Updated 2 days ago</p>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-foreground font-medium">{course.students}</td>
                                <td className="py-4 px-6 text-foreground font-medium">{course.revenue}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                        <span className="font-medium">{course.rating}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {course.status}
                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return renderOverview();
            case "courses":
                return renderCourses();
            case "students":
                return <div className="text-center py-12 text-muted-foreground">Students management coming soon...</div>;
            case "instructors":
                return <div className="text-center py-12 text-muted-foreground">Instructors management coming soon...</div>;
            case "analytics":
                return <div className="text-center py-12 text-muted-foreground">Advanced analytics coming soon...</div>;
            case "messages":
                return <div className="text-center py-12 text-muted-foreground">Messages management coming soon...</div>;
            case "settings":
                return <div className="text-center py-12 text-muted-foreground">Settings panel coming soon...</div>;
            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar - Space for main navbar */}
            <div className="h-16 bg-card border-b border-border"></div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-card border-r border-border min-h-screen">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-foreground mb-6">Admin Dashboard</h2>
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                                        activeTab === item.id
                                            ? "bg-primary text-white"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="bg-card border-b border-border px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground capitalize">
                                    {activeTab === "overview" ? "Dashboard Overview" : activeTab}
                                </h1>
                                <p className="text-muted-foreground">
                                    Welcome back! Here's what's happening with your academy.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Today
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;