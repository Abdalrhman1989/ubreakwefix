
import React, { useState } from 'react';
import { X, Smartphone, Settings, Info, ChevronRight, HelpCircle } from 'lucide-react';

const FindModelModal = ({ isOpen, onClose }) => {
    const [selectedBrand, setSelectedBrand] = useState('apple');

    if (!isOpen) return null;

    const brands = [
        { id: 'apple', name: 'Apple', icon: '/icons/apple.svg', type: 'ios' },
        { id: 'samsung', name: 'Samsung', icon: '/icons/samsung.svg', type: 'android' },
        { id: 'huawei', name: 'Huawei', icon: '/icons/huawei.svg', type: 'android' },
        { id: 'oneplus', name: 'OnePlus', icon: '/icons/oneplus.svg', type: 'android' },
        { id: 'xiaomi', name: 'Xiaomi', icon: '/icons/xiaomi.svg', type: 'android' },
        { id: 'google', name: 'Google', icon: '/icons/google.svg', type: 'android' },
        { id: 'other', name: 'Andet', icon: null, type: 'android' }
    ];

    // Theme Configuration for each Brand
    const brandThemes = {
        apple: { color: '#007AFF', bg: '#F2F2F7', settingsIcon: '#8E8E93', label: 'Generelt' },
        samsung: { color: '#1679FA', bg: '#f8f9fa', settingsIcon: '#1679FA', label: 'Om telefonen' }, // OneUI Blue
        huawei: { color: '#CF0A2C', bg: '#f5f5f5', settingsIcon: '#CF0A2C', label: 'Om telefonen' }, // Huawei Red
        oneplus: { color: '#F50514', bg: '#fff', settingsIcon: '#F50514', label: 'Om enheden' }, // OnePlus Red
        xiaomi: { color: '#FF6900', bg: '#fff', settingsIcon: '#FF6900', label: 'Min enhed' }, // Xiaomi Orange
        google: { color: '#4285F4', bg: '#F1F5F9', settingsIcon: '#4285F4', label: 'Om telefonen' }, // Pixel Blue
        other: { color: '#666', bg: '#f0f0f0', settingsIcon: '#666', label: 'Om telefonen' }
    };

    const currentTheme = brandThemes[selectedBrand] || brandThemes.other;

    const getInstructions = (brandId) => {
        switch (brandId) {
            case 'apple':
                return {
                    step1: "Find 'Indstillinger' (Gråt tandhjul)",
                    step2: "Tryk på 'Generelt'",
                    step3: "Tryk på 'Om' øverst",
                    result: "Se 'Modelnavn' (f.eks. iPhone 13) og 'Modelnummer'"
                };
            case 'samsung':
                return {
                    step1: "Åbn 'Indstillinger'",
                    step2: "Rul helt ned til bunden",
                    step3: "Tryk på 'Om telefonen'",
                    result: "Se modelnavn (f.eks. Galaxy S23) og nummer (SM-...)"
                };
            case 'huawei':
                return {
                    step1: "Åbn 'Indstillinger'",
                    step2: "Rul ned til 'Om telefonen' (ofte i bunden)",
                    step3: "Eller søg efter 'Om' i toppen",
                    result: "Se 'Enhedsnavn' og 'Model'"
                };
            case 'oneplus':
                return {
                    step1: "Åbn 'Indstillinger'",
                    step2: "Tryk på 'Om enheden' (About Device)",
                    step3: "Ofte farverigt ikon i menuen",
                    result: "Her står modelnavn og specifikationer"
                };
            case 'xiaomi':
                return {
                    step1: "Åbn 'Indstillinger'",
                    step2: "Tryk på 'Om telefonen' eller 'Min Enhed'",
                    step3: "Det ligger ofte helt i toppen (Min enhed)",
                    result: "Se 'Enhedsnavn' og detaljer"
                };
            default:
                return {
                    step1: "Åbn 'Indstillinger' appen",
                    step2: "Led efter 'Om telefonen' eller 'System'",
                    step3: "Det er typisk det sidste punkt i menuen",
                    result: "Find modelnavn eller nummer i oversigten"
                };
        }
    };

    const instr = getInstructions(selectedBrand);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-color)',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'modalSlideIn 0.3s ease-out'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '25px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-surface)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '5px', color: 'var(--text-main)' }}>
                            Find din model
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Vælg dit mærke for at se guiden
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-element)',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">

                    {/* Sidebar / Brand Selector */}
                    <div className="brand-sidebar">
                        <h4 className="sidebar-title">Vælg Mærke</h4>
                        <div className="brand-list">
                            {brands.map(brand => (
                                <button
                                    key={brand.id}
                                    onClick={() => setSelectedBrand(brand.id)}
                                    className={`brand-btn ${selectedBrand === brand.id ? 'active' : ''}`}
                                    style={{
                                        '--brand-color': brandThemes[brand.id]?.color || '#666'
                                    }}
                                >
                                    {brand.id === 'apple' ? <Smartphone size={18} /> :
                                        brand.id === 'other' ? <HelpCircle size={18} /> :
                                            <Smartphone size={18} />}
                                    <span className="brand-name">{brand.name}</span>
                                    {selectedBrand === brand.id && <ChevronRight size={16} className="chevron-icon" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="content-area">
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                            <h3 className="guide-title">
                                Sådan finder du din {brands.find(b => b.id === selectedBrand).name} model
                            </h3>

                            <div className="steps-grid">
                                {/* Step 1 */}
                                <div className="step-card">
                                    <div className="step-badge">1</div>
                                    <h4 className="step-title">Trin 1</h4>
                                    <p className="step-desc">{instr.step1}</p>
                                    <div className="mock-phone">
                                        <div
                                            className="app-icon"
                                            style={{
                                                background: selectedBrand === 'apple' ? 'linear-gradient(135deg, #8e8e93, #636366)' : currentTheme.color,
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <Settings size={22} color="#fff" />
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="step-card">
                                    <div className="step-badge">2</div>
                                    <h4 className="step-title">Trin 2</h4>
                                    <p className="step-desc">{instr.step2}</p>
                                    <div className="mock-screen">
                                        {/* Dynamic Order based on Brand */}
                                        {selectedBrand === 'xiaomi' ? (
                                            // Xiaomi unique layout: Top Item
                                            <>
                                                <div className="mock-row active" style={{ color: currentTheme.color, background: `${currentTheme.color}15` }}>
                                                    {currentTheme.label}
                                                </div>
                                                <div className="mock-row">...</div>
                                                <div className="mock-row">...</div>
                                            </>
                                        ) : (
                                            // Other Androids: Bottom Item
                                            <>
                                                <div className="mock-row">...</div>
                                                <div className="mock-row">...</div>
                                                <div className="mock-row active" style={{ color: currentTheme.color, background: `${currentTheme.color}15` }}>
                                                    {currentTheme.label}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="step-card">
                                    <div className="step-badge">3</div>
                                    <h4 className="step-title">Trin 3</h4>
                                    <p className="step-desc">{instr.step3}</p>
                                    <div className="mock-screen">
                                        <div className="mock-header">
                                            {currentTheme.label}
                                        </div>
                                        <div className="mock-info-card" style={{ border: `2px solid ${currentTheme.color}`, background: '#fff' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Model</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                {selectedBrand === 'apple' ? 'iPhone 13' :
                                                    selectedBrand === 'samsung' ? 'Galaxy S23' :
                                                        selectedBrand === 'huawei' ? 'P30 Pro' :
                                                            selectedBrand === 'oneplus' ? 'OnePlus 11' :
                                                                selectedBrand === 'xiaomi' ? 'Xiaomi 13' : 'Modelnavn'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="found-it-card">
                                <h4 style={{ fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Info size={18} color="var(--primary)" /> Fandt du den?
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    {instr.result}. Indtast navnet i søgefeltet for at se reparationspriser.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .modal-body {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    height: 100%;
                }

                .brand-sidebar {
                    width: 250px;
                    background: var(--bg-surface);
                    border-right: 1px solid var(--border-color);
                    overflow-y: auto;
                    padding: 20px;
                    flex-shrink: 0;
                }

                .sidebar-title {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    margin-bottom: 15px;
                    font-weight: bold;
                }

                .brand-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .brand-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: var(--text-main);
                    cursor: pointer;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    width: 100%;
                }

                .brand-btn:hover {
                    background: var(--bg-element);
                }

                .brand-btn.active {
                    background: var(--primary); /* Fallback */
                    background: var(--brand-color);
                    color: #fff;
                }
                
                .chevron-icon { margin-left: auto; }

                .content-area {
                    flex: 1;
                    padding: 40px;
                    overflow-y: auto;
                    background: var(--bg-body);
                }

                .guide-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 30px;
                    color: var(--text-main);
                }

                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                }
                
                .found-it-card {
                    margin-top: 40px;
                    padding: 20px;
                    background: rgba(var(--primary-rgb), 0.05);
                    border-radius: 16px; 
                    border: 1px solid var(--border-color);
                }

                .step-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .step-badge {
                    width: 32px; height: 32px; background: var(--primary); color: white;
                    border-radius: 50%; display: flex; alignItems: center; justifyContent: center;
                    font-weight: bold; margin-bottom: 12px;
                }
                .step-title { font-weight: 700; margin-bottom: 8px; color: var(--text-main); }
                .step-desc { font-size: 0.85rem; color: var(--text-muted); min-height: 40px; margin-bottom: 15px; }

                /* Mock UI */
                .mock-phone {
                    width: 100px; height: 160px; background: #f2f2f2; border-radius: 12px; border: 3px solid #333;
                    display: flex; alignItems: center; justifyContent: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    color: #333;
                }
                .app-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; alignItems: center; justifyContent: center; }

                .mock-screen {
                    width: 140px; background: #fff; border-radius: 12px; border: 1px solid #e5e5e5;
                    overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    color: #333;
                }
                .mock-row { padding: 10px; border-bottom: 1px solid #f9f9f9; font-size: 0.75rem; color: #555; }
                .mock-row.active { font-weight: 600; }
                
                .mock-header { padding: 8px; background: #f5f5f5; font-size: 0.75rem; font-weight: 600; text-align: center; color: #333; }
                .mock-info-card { margin: 10px; padding: 10px; background: #f9f9f9; border-radius: 8px; text-align: center; color: #333; }
                
                @media (max-width: 768px) {
                    .modal-body {
                        flex-direction: column;
                    }

                    .brand-sidebar {
                        width: 100% !important;
                        height: auto;
                        border-right: none;
                        border-bottom: 1px solid var(--border-color);
                        padding: 15px;
                    }
                    
                    .brand-list {
                        flex-direction: row;
                        overflow-x: auto;
                        padding-bottom: 5px; /* space for scrollbar */
                        gap: 10px;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    /* Hide scrollbar but keep functionality */
                    .brand-list::-webkit-scrollbar {
                        height: 0px;
                        background: transparent;
                    }

                    .sidebar-title { display: none; }

                    .brand-btn {
                        width: auto;
                        flex-shrink: 0;
                        padding: 8px 16px;
                        background: var(--bg-element);
                        border-radius: 20px;
                        font-size: 0.9rem;
                    }
                    
                    .brand-btn.active {
                         background: var(--brand-color);
                         color: #fff;
                    }
                    
                    .brand-name {
                        display: block; /* Show text on mobile */
                    }

                    .chevron-icon { display: none; }
                    
                    .content-area {
                        padding: 25px;
                    }
                    
                    .steps-grid {
                        grid-template-columns: 1fr; /* Stack steps on mobile */
                        gap: 40px; /* More space between stacked steps */
                        max-width: 300px;
                        margin: 0 auto;
                    }
                    
                    .guide-title {
                        font-size: 1.4rem;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default FindModelModal;
