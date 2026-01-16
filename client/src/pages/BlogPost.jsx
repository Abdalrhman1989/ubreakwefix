
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { blogPosts } from '../data/blogPosts';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const BlogPost = () => {
    const { slug } = useParams();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const post = blogPosts.find(p => p.slug === slug);

    const content = post ? (post[language] || post.da) : null;

    console.log('BlogPost Debug:', { slug, postFound: !!post, language, hasContent: !!content });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        console.warn('BlogPost: Post not found for slug:', slug);
        return (
            <div style={{ padding: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Post not found</h2>
                <Link to="/blog" style={{ color: 'var(--primary)' }}>{t('blog.backToBlog')}</Link>
            </div>
        );
    }

    if (!content) {
        console.error('BlogPost: Content missing for post:', post.id, 'Language:', language);
        return (
            <div style={{ padding: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Content unavailable</h2>
                <Link to="/blog" style={{ color: 'var(--primary)' }}>{t('blog.backToBlog')}</Link>
            </div>
        );
    }

    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)', padding: '60px 0 100px' }}>
            <Helmet>
                <title>{content.seoTitle || 'Blog Post'}</title>
                <meta name="description" content={content.seoDesc || ''} />
                <meta property="og:title" content={content.seoTitle || ''} />
                <meta property="og:description" content={content.seoDesc || ''} />
                <meta property="og:image" content={post.image || ''} />
                <meta property="og:type" content="article" />
            </Helmet>

            <div className="container">
                {/* Back Button */}
                <Link to="/blog" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    marginBottom: '40px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'color 0.2s'
                }} className="back-link">
                    <ArrowLeft size={18} /> {t('blog.backToBlog')}
                </Link>

                <div className="blog-layout">

                    {/* Main Content */}
                    <article className="blog-article">
                        <header style={{ marginBottom: '40px' }}>
                            <div style={{
                                display: 'inline-block',
                                background: 'rgba(var(--primary-rgb), 0.1)',
                                color: 'var(--primary)',
                                padding: '6px 14px',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                marginBottom: '20px'
                            }}>
                                {post.category}
                            </div>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: '800',
                                lineHeight: '1.2',
                                marginBottom: '25px',
                                color: 'var(--text-main)'
                            }}>
                                {content.title}
                            </h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={18} /> {post.author}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={18} /> {post.date}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={18} /> 5 min read
                                </span>
                            </div>
                        </header>

                        <div style={{ marginBottom: '50px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.2)' }}>
                            <img src={post.image} alt={content.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <div
                            className="blog-content"
                            style={{
                                fontSize: '1.2rem',
                                lineHeight: '1.8',
                                color: 'var(--text-secondary)'
                            }}
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    </article>

                    {/* Sidebar / More Posts */}
                    <aside className="blog-sidebar">
                        <div className="sticky-sidebar">
                            <h3 style={{
                                fontSize: '1.2rem',
                                marginBottom: '25px',
                                fontWeight: '700',
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {t('blog.relatedPosts')}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {relatedPosts.map(related => {
                                    const relatedContent = related[language] || related.da;
                                    if (!relatedContent) return null;

                                    return (
                                        <Link key={related.id} to={`/blog/${related.slug}`} className="related-card" style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                padding: '20px',
                                                borderRadius: '16px',
                                                background: 'var(--bg-card)',
                                                border: '1px solid var(--border-color)',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.5', fontWeight: '600' }}>
                                                    {relatedContent.title}
                                                </h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{related.date}</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .blog-layout {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 60px;
                }
                
                @media (max-width: 1024px) {
                    .blog-layout {
                        grid-template-columns: 1fr;
                        gap: 80px;
                    }
                    .sticky-sidebar {
                        position: static !important;
                    }
                    .blog-sidebar {
                        margin-top: 40px;
                        border-top: 1px solid var(--border-color);
                        padding-top: 40px;
                    }
                }

                .back-link:hover {
                    color: var(--primary) !important;
                }

                .related-card:hover > div {
                    transform: translateY(-3px);
                    border-color: var(--primary) !important;
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
                }

                /* Typography Improvements */
                .blog-content h2 {
                    font-size: 1.8rem;
                    color: var(--text-main);
                    margin-top: 50px;
                    margin-bottom: 25px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }
                .blog-content h3 {
                    font-size: 1.5rem;
                    color: var(--text-main);
                    margin-top: 40px;
                    margin-bottom: 20px;
                    font-weight: 700;
                }
                .blog-content p {
                    margin-bottom: 25px;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 30px;
                    padding-left: 20px;
                }
                .blog-content li {
                    margin-bottom: 12px;
                    padding-left: 5px;
                }
                .sticky-sidebar {
                    position: sticky;
                    top: 100px;
                }
            `}</style>
        </div>
    );
};

export default BlogPost;
