'use client'
import React, { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    User,
    Clock,
    Eye,
    Heart,
    Share2,
    BookOpen,
    Filter,
    ChevronDown,
    ArrowRight,
    Tag,
    TrendingUp,
    MessageCircle,
    Code,
    Lightbulb,
    Leaf,
    Globe
} from 'lucide-react';

const BlogPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const postsPerPage = 6;

    // Loading simulation
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1200));
            setIsLoading(false);
        };
        loadData();
    }, []);

    const categories = [
        { id: 'All', name: 'All Posts', count: 24, icon: Globe },
        { id: 'STEM', name: 'STEM Education', count: 8, icon: Code },
        { id: 'Digital', name: 'Digital Literacy', count: 6, icon: BookOpen },
        { id: 'Entrepreneurship', name: 'Green Entrepreneurship', count: 5, icon: Leaf },
        { id: 'Innovation', name: 'Innovation', count: 5, icon: Lightbulb }
    ];

    const tags = ['All', 'Technology', 'Education', 'Sustainability', 'AI', 'Web Development', 'Leadership', 'Career', 'Innovation'];

    const blogPosts = [
        {
            id: 1,
            title: 'The Future of STEM Education in Rwanda: Bridging Traditional Learning with Modern Technology',
            excerpt: 'Exploring how Rwanda is revolutionizing STEM education through innovative teaching methods and technology integration.',
            content: 'Full article content would go here...',
            author: {
                name: 'Dr. Sarah Uwimana',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                role: 'STEM Education Specialist'
            },
            category: 'STEM',
            tags: ['Technology', 'Education', 'Innovation'],
            publishedAt: '2024-01-15',
            readTime: '5 min read',
            views: 1234,
            likes: 89,
            comments: 12,
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            featured: true
        },
        {
            id: 2,
            title: 'Building Sustainable Startups: A Guide for Young Entrepreneurs in East Africa',
            excerpt: 'Learn the essential steps to create environmentally conscious businesses that drive positive change in your community.',
            content: 'Full article content would go here...',
            author: {
                name: 'Jean Baptiste Nzeyimana',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                role: 'Green Business Mentor'
            },
            category: 'Entrepreneurship',
            tags: ['Sustainability', 'Leadership', 'Career'],
            publishedAt: '2024-01-12',
            readTime: '7 min read',
            views: 982,
            likes: 67,
            comments: 18,
            image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
            featured: false
        },
        {
            id: 3,
            title: 'Digital Literacy Beyond Basic Computer Skills: Preparing for the AI Era',
            excerpt: 'Understanding what digital literacy means in 2024 and how to prepare students for an AI-driven future.',
            content: 'Full article content would go here...',
            author: {
                name: 'Marie Mukamana',
                avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
                role: 'Digital Innovation Lead'
            },
            category: 'Digital',
            tags: ['AI', 'Technology', 'Education'],
            publishedAt: '2024-01-10',
            readTime: '6 min read',
            views: 1567,
            likes: 124,
            comments: 23,
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
            featured: true
        },
        {
            id: 4,
            title: 'Faith and Leadership: Integrating Values in Modern Educational Practices',
            excerpt: 'How faith-based coaching is transforming leadership development in educational institutions.',
            content: 'Full article content would go here...',
            author: {
                name: 'Pastor David Muhire',
                avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
                role: 'Faith-Based Leadership Coach'
            },
            category: 'Innovation',
            tags: ['Leadership', 'Education', 'Innovation'],
            publishedAt: '2024-01-08',
            readTime: '4 min read',
            views: 756,
            likes: 45,
            comments: 8,
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
            featured: false
        },
        {
            id: 5,
            title: 'From Classroom to Code: Teaching Programming to Rwandan Youth',
            excerpt: 'Success stories and best practices from our coding bootcamps across Rwanda.',
            content: 'Full article content would go here...',
            author: {
                name: 'Eng. Marie Uwizera',
                avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
                role: 'Software Engineering Instructor'
            },
            category: 'STEM',
            tags: ['Web Development', 'Technology', 'Career'],
            publishedAt: '2024-01-05',
            readTime: '8 min read',
            views: 2134,
            likes: 156,
            comments: 34,
            image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80',
            featured: false
        },
        {
            id: 6,
            title: 'Environmental Innovation: Student-Led Projects Making Real Impact',
            excerpt: 'Showcasing remarkable environmental projects developed by our students across different programs.',
            content: 'Full article content would go here...',
            author: {
                name: 'Prof. Green Habimana',
                avatar: 'https://randomuser.me/api/portraits/men/49.jpg',
                role: 'Environmental Science Professor'
            },
            category: 'Entrepreneurship',
            tags: ['Sustainability', 'Innovation', 'Education'],
            publishedAt: '2024-01-03',
            readTime: '6 min read',
            views: 1089,
            likes: 78,
            comments: 15,
            image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80',
            featured: true
        }
    ];


    // Filter and sort posts
    const filteredPosts = blogPosts
        .filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
            const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

            return matchesSearch && matchesCategory && matchesTag;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return b.views - a.views;
                case 'likes':
                    return b.likes - a.likes;
                case 'comments':
                    return b.comments - a.comments;
                default:
                    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

    const LoadingScreen = () => (
        <div className="min-h-screen bg-background flex items-center justify-center pt-16">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-2xl font-semibold mb-2">Loading Blog Posts</h2>
                <p className="text-muted-foreground">Fetching the latest articles for you...</p>
                <div className="w-64 bg-muted rounded-full h-2 mx-auto mt-4">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-background pt-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">21st Century Academy Blog</h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Insights, innovations, and inspiration from the world of modern education, technology, and sustainable development.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-blue-200">
                        <div className="flex items-center space-x-2">
                            <BookOpen size={20} />
                            <span>{blogPosts.length} Articles</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User size={20} />
                            <span>Expert Authors</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TrendingUp size={20} />
                            <span>Weekly Updates</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden w-full mb-6 px-4 py-3 bg-card border border-border rounded-lg flex items-center justify-between"
                        >
                            <span className="font-medium">Filters</span>
                            <ChevronDown size={20} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            {/* Search */}
                            <div className="bg-card p-4 rounded-xl shadow-md">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                                    <Search size={18} className="mr-2" />
                                    Search Articles
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-card p-4 rounded-xl shadow-md">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                                    <Filter size={18} className="mr-2" />
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const CategoryIcon = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                                    selectedCategory === category.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <CategoryIcon size={16} />
                                                    <span className="text-sm font-medium">{category.name}</span>
                                                </div>
                                                <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full font-medium">{category.count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-card p-4 rounded-xl shadow-md">
                                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                                    <Tag size={18} className="mr-2" />
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                                selectedTag === tag
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="bg-card p-4 rounded-xl shadow-md">
                                <h3 className="font-semibold text-foreground mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="likes">Most Liked</option>
                                    <option value="comments">Most Discussed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {selectedCategory === 'All' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
                                </h2>
                                <p className="text-muted-foreground">
                                    {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
                                </p>
                            </div>
                        </div>

                        {/* Featured Posts */}
                        {currentPage === 1 && filteredPosts.some(post => post.featured) && (
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                                    <TrendingUp size={20} className="mr-2 text-primary" />
                                    Featured Articles
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {filteredPosts.filter(post => post.featured).slice(0, 2).map((post) => (
                                        <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                                                    Featured
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                                                    <span className="bg-accent px-2 py-1 rounded">{post.category}</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar size={12} />
                                                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                    {post.title}
                                                </h4>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={post.author.avatar}
                                                            alt={post.author.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                                                            <p className="text-xs text-muted-foreground">{post.readTime}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-primary hover:text-primary/80 transition-colors duration-200">
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Posts Grid */}
                        {currentPosts.length === 0 ? (
                            <div className="text-center py-16">
                                <Search size={64} className="mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
                                <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                {currentPosts.filter(post => !post.featured || currentPage > 1).map((post) => (
                                    <article key={post.id} className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                                                {post.category}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={12} />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                {post.title}
                                            </h4>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                                                        <p className="text-xs text-muted-foreground">{post.author.role}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <Eye size={12} />
                                                        <span>{post.views}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Heart size={12} />
                                                        <span>{post.likes}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MessageCircle size={12} />
                                                        <span>{post.comments}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 rounded-full hover:bg-accent transition-colors duration-200">
                                                        <Heart size={14} className="text-muted-foreground hover:text-red-500" />
                                                    </button>
                                                    <button className="p-2 rounded-full hover:bg-accent transition-colors duration-200">
                                                        <Share2 size={14} className="text-muted-foreground hover:text-primary" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                            currentPage === index + 1
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                        Subscribe to our newsletter and never miss our latest articles, insights, and educational resources.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border-0 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                        />
                        <button className="px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-background/90 transition-colors duration-200">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;