import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Debounce search
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 1) {
                axios.get(`http://localhost:3001/api/models?search=${query}`)
                    .then(res => {
                        setResults(res.data);
                        setShowResults(true);
                    })
                    .catch(e => console.error(e));
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close on click outside
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
                    placeholder="Indtast venligst dit mærke og model"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px 20px 16px 50px',
                        borderRadius: '50px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                        outline: 'none'
                    }}
                    onFocus={() => query.length > 1 && setShowResults(true)}
                />
                <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            </div>

            {showResults && results.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '20px',
                    right: '20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    marginTop: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0'
                }}>
                    {results.map(model => (
                        <div
                            key={model.id}
                            onClick={() => handleSelect(model.id)}
                            style={{
                                padding: '12px 20px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <div style={{ marginRight: '10px', fontWeight: 'bold', color: '#666', fontSize: '0.8rem' }}>{model.brand_name}</div>
                            <div>{model.name}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBox;
