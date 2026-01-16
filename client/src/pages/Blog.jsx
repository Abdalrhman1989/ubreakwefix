import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { blogPosts } from '../data/blogPosts';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
    const { t, language } = useLanguage();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: '60px 0 100px' }}>
            <Helmet>
                <title>{t('blog.title')} | UBreak WeFix {t('seo.location') || 'Odense'}</title>
                <meta name="description" content={t('blog.subtitle')} />
            </Helmet>

            <div className="container">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(var(--primary-rgb), 0.1)',
                        color: 'var(--primary)',
                        borderRadius: '30px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '20px'
                    }}>
                        {t('nav.blog')}
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {t('blog.title')}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {t('blog.subtitle')}
                    </p>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '40px'
                }}>
                    {blogPosts.map(post => {
                        const content = post[language] || post.da;
                        if (!content) return null;

                        return (
                            <div key={post.id} style={{ display: 'flex' }}>
                                <Link to={`/blog/${post.slug}`} className="blog-card" style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'var(--bg-card)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    width: '100%',
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                                        <img
                                            src={post.image}
                                            alt={content.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            className="blog-img"
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            left: '20px',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            color: '#000',
                                            padding: '6px 14px',
                                            borderRadius: '100px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}>
                                            {post.category}
                                        </div>
                                    </div>

                                    <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={14} /> {post.date}
                                            </span>
                                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)' }}></span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} /> {post.author}
                                            </span>
                                        </div>

                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '15px',
                                            lineHeight: '1.3',
                                            fontWeight: '700',
                                            color: 'var(--text-main)'
                                        }}>
                                            {content.title}
                                        </h2>

                                        <p style={{
                                            color: 'var(--text-muted)',
                                            lineHeight: '1.6',
                                            marginBottom: '25px',
                                            flex: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {content.excerpt}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'var(--primary)',
                                            fontWeight: '600',
                                            gap: '8px',
                                            marginTop: 'auto'
                                        }}>
                                            {t('blog.readMore')} <ArrowRight size={18} className="arrow-icon" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>

            <style>{`
                .blog-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
                    border-color: var(--primary);
                }
                .blog-card:hover .blog-img {
                    transform: scale(1.08);
                }
                .blog-card:hover .arrow-icon {
                    transform: translateX(5px);
                }
                .arrow-icon {
                    transition: transform 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default Blog;
