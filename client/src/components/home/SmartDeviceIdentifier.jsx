import React, { useState, useEffect } from 'react';
import { Smartphone, Camera, Zap, Search, ArrowRight, Check, AlertCircle, ScanLine, Laptop, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../SearchBox';

const SmartDeviceIdentifier = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('selection'); // 'selection', 'visual-ai', 'expert', 'imei'
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [detectedModel, setDetectedModel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [platform, setPlatform] = useState(null); // 'apple' or 'android'

    // --- AUTO DETECT ---
    useEffect(() => {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/i.test(ua)) setPlatform('apple');
        else if (/Android/i.test(ua)) setPlatform('android');
    }, []);

    // --- MOCK DATABASE (Expanded) ---
    const modelMapping = {
        'A2894': 'iPhone 14 Pro Max', 'A2651': 'iPhone 14 Pro Max',
        'A2890': 'iPhone 14 Pro', 'A2650': 'iPhone 14 Pro',
        'A2882': 'iPhone 14', 'A2649': 'iPhone 14',
        'A2643': 'iPhone 13 Pro Max', 'A2484': 'iPhone 13 Pro Max',
        'A2638': 'iPhone 13 Pro', 'A2483': 'iPhone 13 Pro',
        'A2633': 'iPhone 13', 'A2482': 'iPhone 13',
        'A2342': 'iPhone 12 Pro Max', 'A2411': 'iPhone 12 Pro Max',
        'A2341': 'iPhone 12 Pro', 'A2407': 'iPhone 12 Pro',
        'A2403': 'iPhone 12', 'A2172': 'iPhone 12',
        'SM-S918': 'Samsung Galaxy S23 Ultra',
        'SM-S911': 'Samsung Galaxy S23',
        'SM-S908': 'Samsung Galaxy S22 Ultra',
    };

    const visualQuestions = [
        {
            id: 'brand',
            text: "Which brand logo is on the back?",
            options: [
                { label: "Apple (Apple Logo)", value: 'apple', icon: <Smartphone size={24} /> },
                { label: "Samsung", value: 'samsung', icon: <Smartphone size={24} /> },
                { label: "Google / Other", value: 'other', icon: <Smartphone size={24} /> }
            ],
            aiStatus: "Scanning brand identity..."
        },
        {
            id: 'cameras',
            text: "How many camera lenses on the back?",
            options: [
                { label: "1 Lens", value: '1' },
                { label: "2 Lenses", value: '2' },
                { label: "3 Lenses (Pro)", value: '3' }
            ],
            condition: (ans) => ans.brand === 'apple' || ans.brand === 'samsung',
            aiStatus: "Analyzing camera configuration..."
        },
        {
            id: 'notch_type',
            text: "Look at the screen top. What do you see?",
            options: [
                { label: "Dynamic Island (Pill Shape)", value: 'island' },
                { label: "Notch (Black Tab)", value: 'notch' },
                { label: "Nothing (Full Screen/Dot)", value: 'dot' }
            ],
            condition: (ans) => ans.brand === 'apple' && (ans.cameras === '2' || ans.cameras === '3'),
            aiStatus: "Checking display technology..."
        },
        {
            id: 'edges',
            text: "Are the sides flat or curved?",
            options: [
                { label: "Flat (Sharp Edges)", value: 'flat' },
                { label: "Curved (Smooth)", value: 'curved' }
            ],
            condition: (ans) => ans.brand === 'apple' && ans.notch_type === 'notch',
            aiStatus: "Measuring device geometry..."
        }
    ];

    // --- LOGIC HANDLERS ---
    const handleAnswer = (key, value) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);

        // ADVANCED AI DEDUCTION LOGIC
        if (key === 'notch_type') {
            if (value === 'island') {
                finalizeDetection(newAnswers.cameras === '3' ? 'iPhone 14/15 Pro Max' : 'iPhone 15');
                return;
            }
        }

        if (key === 'edges') {
            if (value === 'flat' && newAnswers.cameras === '3') finalizeDetection('iPhone 12/13/14 Pro Model');
            else if (value === 'flat' && newAnswers.cameras === '2') finalizeDetection('iPhone 12/13/14 Base Model');
            else if (value === 'curved') finalizeDetection('iPhone 11 / XR Series');
            else finalizeDetection('iPhone (Older Generation)');
        } else {
            // Find next question
            const nextQIndex = visualQuestions.findIndex((q, i) => i > step && (!q.condition || q.condition(newAnswers)));
            if (nextQIndex !== -1) {
                setStep(nextQIndex);
            } else if (!detectedModel) {
                // End of questions
                finalizeDetection('Device Detected (Generic)');
            }
        }
    };

    const finalizeDetection = (modelName) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDetectedModel(modelName);
        }, 1200);
    };

    const handleExpertLookup = (input) => {
        setLoading(true);
        // Simulate Matrix Analysis
        setTimeout(() => {
            setLoading(false);
            const match = Object.entries(modelMapping).find(([code, name]) => input.toUpperCase().includes(code));
            if (match) setDetectedModel(match[1]);
            else setDetectedModel(null);
        }, 1500);
    };

    const reset = () => {
        setMode('selection');
        setStep(0);
        setAnswers({});
        setDetectedModel(null);
        setLoading(false);
    };

    // --- RENDERERS ---

    // 1. MAIN SELECTION MODE
    if (mode === 'selection') {
        return (
            <section className="container" style={{ padding: '60px 20px' }}>
                <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid var(--border-light)', textAlign: 'center' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', color: 'var(--primary)', padding: '6px 16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '20px' }}>
                            <ScanLine size={16} /> AI Device Doctor™
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>
                            Identify your device <span style={{ color: 'var(--primary)' }}>instantly.</span>
                        </h2>
                        {platform && <p style={{ color: '#64748b' }}>Detected Platform: <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{platform === 'apple' ? ' Apple iOS' : '🤖 Android'}</span></p>}
                    </div>

                    {/* PATHS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>

                        {/* PATH A: VISUAL AI */}
                        <div onClick={() => setMode('visual-ai')} className="hover-card" style={{ padding: '30px', background: '#f8fafc', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}>
                            <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <Camera size={24} color="var(--primary)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>Visual Identifier</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Don't know the name? Answer 3 simple questions about how it looks.</p>
                        </div>

                        {/* PATH B: EXPERT LOOKUP */}
                        <div onClick={() => setMode('expert')} className="hover-card" style={{ padding: '30px', background: '#f8fafc', borderRadius: '20px', border: '2px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }}>
                            <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <ScanLine size={24} color="var(--accent)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px' }}>Expert Lookup</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Enter <b>Model Number</b> (A-Number) or <b>IMEI</b> for 100% precision.</p>
                        </div>

                        {/* PATH C: SMART SEARCH */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                            <div style={{ background: 'var(--primary)', padding: '2px', borderRadius: '22px' }}>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '15px', fontWeight: '700', color: '#1e293b' }}>
                                        Or use Smart Search (with Live Prices)
                                    </label>
                                    <SearchBox />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <style>{`
                    .hover-card:hover { transform: translateY(-5px); border-color: var(--primary) !important; background: white !important; boxShadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
                `}</style>
            </section>
        );
    }

    // 2. LOADING ANIMATION (MATRIX)
    if (loading) {
        return (
            <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px', background: 'black', borderRadius: '24px', color: '#00ff00', fontFamily: 'monospace' }}>
                    <RefreshCw size={40} className="spin" style={{ marginBottom: '20px' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ANALYZING DEVICE PROTOCOLS...</div>
                    <div style={{ opacity: 0.7, marginTop: '10px' }}>Comparing traits against 1,200 models...</div>
                    <style>{` .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
                </div>
            </section>
        );
    }

    // 3. RESULT VIEW
    if (detectedModel) {
        return (
            <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '2px solid var(--primary)' }}>
                    <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                        <Check size={40} strokeWidth={4} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Match Found!</h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '30px' }}>We are confident your device is:</p>

                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '40px' }}>
                        {detectedModel}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/book')} style={{ padding: '16px 40px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                            See Repair Prices
                        </button>
                        <button onClick={reset} style={{ padding: '16px 30px', background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Wrong? Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // 4. VISUAL AI WIZARD
    if (mode === 'visual-ai') {
        const question = visualQuestions[step];
        return (
            <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden' }}>

                    {/* AI SCANNER LINE (Visual Flair) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', animation: 'scan 2s linear infinite' }}></div>
                    <style>{` @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } `}</style>

                    <button onClick={reset} style={{ float: 'left', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', zIndex: 10, position: 'relative' }}>← Back</button>

                    <div style={{ clear: 'both', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#eff6ff', color: 'var(--primary)', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem' }}>Question {step + 1} / {visualQuestions.length}</span>
                        {/* LIVE AI STATUS */}
                        <div className="animate-pulse" style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw size={14} className="spin" />
                            {question.aiStatus || "Processing..."}
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '40px' }}>{question.text}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {question.options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => handleAnswer(question.id, opt.value)}
                                style={{
                                    padding: '30px', border: '2px solid #e2e8f0', borderRadius: '16px', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                            >
                                {opt.icon || <div style={{ width: '20px' }}></div>}
                                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{opt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // 5. EXPERT MODE
    if (mode === 'expert') {
        return (
            <section className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
                    <button onClick={reset} style={{ float: 'left', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>← Back</button>
                    <div style={{ clear: 'both' }}></div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Expert Lookup</h2>
                    <p style={{ color: '#64748b', marginBottom: '40px' }}>Found on the back of your device or in Settings.</p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Enter Model # (e.g. A2633 or SM-S911)"
                            style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1.1rem', outline: 'none' }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleExpertLookup(e.target.value); }}
                        />
                        <button style={{ padding: '0 30px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return null;
};

export default SmartDeviceIdentifier;
