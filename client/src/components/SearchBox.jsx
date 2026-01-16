import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Smartphone, Zap, Layers, Clock, ArrowRight, Sparkles, Droplets } from 'lucide-react';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [aiIntent, setAiIntent] = useState(null); // 'screen', 'battery', 'water'
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 0) {
                // 1. ANALYZE INTENT
                const lowerQ = query.toLowerCase();
                let detectedIntent = null;
                if (lowerQ.includes('screen') || lowerQ.includes('glass') || lowerQ.includes('lcd') || lowerQ.includes('broken')) detectedIntent = 'screen';
                else if (lowerQ.includes('battery') || lowerQ.includes('power') || lowerQ.includes('charge') || lowerQ.includes('die')) detectedIntent = 'battery';
                else if (lowerQ.includes('water') || lowerQ.includes('liquid') || lowerQ.includes('swim')) detectedIntent = 'water';
                setAiIntent(detectedIntent);

                // 2. SEARCH MODELS
                const cleanQuery = query.replace(/screen|glass|lcd|broken|battery|power|charge|die|water|liquid|swim|problem|fix|repair/gi, '').trim();
                const finalQuery = cleanQuery.length > 0 ? cleanQuery : query;

                axios.get(`/api/models?search=${finalQuery}`)
                    .then(res => {
                        setResults(res.data);
                        setShowResults(true);
                    })
                    .catch(e => console.error(e));
            } else {
                setResults([]);
                setShowResults(false);
                setAiIntent(null);
            }
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (modelId) => {
        navigate(`/reparation/${modelId}`);
        setShowResults(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search model (e.g. 'iPhone 13')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px 20px 16px 50px',
                        borderRadius: '50px',
                        border: '2px solid ' + (aiIntent ? 'var(--primary)' : 'var(--border-light)'),
                        background: 'white',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        boxShadow: aiIntent ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : '0 4px 15px rgba(0,0,0,0.08)',
                        outline: 'none',
                        transition: 'all 0.3s'
                    }}
                    onFocus={() => query.length > 0 && setShowResults(true)}
                />
                <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: aiIntent ? 'var(--primary)' : 'var(--text-muted)' }} />

                {aiIntent && (
                    <div className="animate-fade-in" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', background: 'rgba(37, 99, 235, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                        <Sparkles size={12} /> AI Detected: {aiIntent.charAt(0).toUpperCase() + aiIntent.slice(1)} Issue
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    marginTop: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)'
                }}>
                    <div style={{ padding: '8px 0' }}>
                        {results.slice(0, 6).map(model => (
                            <React.Fragment key={model.id}>

                                {/* ADAPTIVE RENDER: If No Intent -> Suggestion Mode. If Intent -> Smart Mode */}

                                {/* --- SUGGESTION MODE (Clean List) --- */}
                                {!aiIntent && (
                                    <div
                                        onClick={() => handleSelect(model.id)}
                                        style={{
                                            padding: '12px 20px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'background 0.2s',
                                            color: '#1e293b',
                                            borderBottom: '1px solid #f8fafc'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ marginRight: '15px', color: '#cbd5e1' }}>
                                            <Search size={16} />
                                        </div>
                                        <div style={{ flex: 1, fontWeight: '500' }}>
                                            {model.name} <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>- {model.brand_name}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                                            See repairs
                                        </div>
                                    </div>
                                )}


                                {/* --- SMART MODE (Detailed Cards) --- */}
                                {aiIntent && (
                                    <>
                                        <div
                                            onClick={() => handleSelect(model.id)}
                                            style={{
                                                padding: '12px 20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'background 0.2s',
                                                color: '#1e293b',
                                                background: '#f8fafc',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}
                                        >
                                            <div style={{ width: '32px', height: '32px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                                                <Smartphone size={18} color="#64748b" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600' }}>{model.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{model.brand_name}</div>
                                            </div>
                                        </div>

                                        {/* Smart Suggestions (Screen/Battery/Water) */}
                                        {(aiIntent === 'screen') && (
                                            <div onClick={() => handleSelect(model.id)} style={{ padding: '10px 20px 10px 68px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Layers size={14} color="#16a34a" style={{ marginRight: '8px' }} />
                                                    <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 'bold' }}>Screen Replacement</span>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#16a34a' }}>1.499 kr</span>
                                            </div>
                                        )}

                                        {(aiIntent === 'battery') && (
                                            <div onClick={() => handleSelect(model.id)} style={{ padding: '10px 20px 10px 68px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff7ed', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Zap size={14} color="#ea580c" style={{ marginRight: '8px' }} />
                                                    <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 'bold' }}>New Battery</span>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ea580c' }}>499 kr</span>
                                            </div>
                                        )}
                                        {(aiIntent === 'water') && (
                                            <div onClick={() => handleSelect(model.id)} style={{ padding: '10px 20px 10px 68px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eff6ff', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Droplets size={14} color="#3b82f6" style={{ marginRight: '8px' }} />
                                                    <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 'bold' }}>Liquid Damage</span>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3b82f6' }}>Free</span>
                                            </div>
                                        )}
                                        <div style={{ height: '4px' }}></div>
                                    </>
                                )}

                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBox;
