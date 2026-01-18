import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gamepad2, ArrowRight, CheckCircle, Smartphone, AlertTriangle, Monitor, RotateCcw, Cpu } from 'lucide-react';
import axios from 'axios';

const ConsoleRepair = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialBrand = searchParams.get('brand') || 'PlayStation';

    const [step, setStep] = useState(1);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Console Models
    useEffect(() => {
        axios.get('/api/models')
            .then(res => {
                const brandsToFilter = ['PlayStation', 'Xbox', 'Nintendo'];
                const consoleModels = res.data.filter(m => brandsToFilter.includes(m.brand_name));
                setModels(consoleModels);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // Filter models based on selection
    const ps5Models = models.filter(m => m.name.includes('PlayStation 5'));
    const ps4Models = models.filter(m => m.name.includes('PlayStation 4'));

    const issues = [
        { id: 'hdmi', label: 'HDMI / No Signal', icon: Monitor, price: 800 },
        { id: 'overheating', label: 'Overheating / Loud Fan', icon: AlertTriangle, price: 500 },
        { id: 'disc', label: 'Disc Drive Issue', icon: RotateCcw, price: 600 },
        { id: 'controller', label: 'Controller Drift', icon: Gamepad2, price: 250 },
        { id: 'power', label: 'Power Issue', icon: ZapIcon, price: 900 },
        { id: 'other', label: 'Other Issue', icon: Cpu, price: 0 } // Price 0 triggers contact
    ];

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setStep(2);
    };

    const handleIssueSelect = (issue) => {
        setSelectedIssue(issue);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Calculate dynamic price based on model age/tier if needed
        // For now using base issue price
    };

    const handleBookNow = () => {
        navigate('/book', {
            state: {
                deviceModel: selectedModel.name,
                problem: selectedIssue.label,
                price: selectedIssue.price
            }
        });
    };

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '100px 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>

                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)',
                        padding: '8px 20px', borderRadius: '30px', fontWeight: 'bold', marginBottom: '20px'
                    }}>
                        <Gamepad2 size={20} /> Smart Diagnosis
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px' }}>
                        Console Repair Center
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                        Identify your console and issue to get an instant quote.
                    </p>
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '2px', background: 'var(--border-light)', zIndex: 0 }}></div>
                    <div style={{ display: 'flex', gap: '150px', position: 'relative', zIndex: 1 }}>
                        <StepIndicator step={1} current={step} icon={Gamepad2} label="Device" />
                        <StepIndicator step={2} current={step} icon={AlertTriangle} label="Issue" />
                        <StepIndicator step={3} current={step} icon={CheckCircle} label="Solution" />
                    </div>
                </div>

                {/* STEP 1: SELECT DEVICE */}
                {step === 1 && (
                    <div className="fade-in">
                        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Select your Console</h3>

                        {loading ? (
                            <div style={{ textAlign: 'center' }}>Loading specific models...</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                {/* Example Grouping */}
                                {ps5Models.map(m => (
                                    <ModelCard key={m.id} model={m} onClick={() => handleModelSelect(m)} />
                                ))}
                                {ps4Models.map(m => (
                                    <ModelCard key={m.id} model={m} onClick={() => handleModelSelect(m)} />
                                ))}
                            </div>
                        )}

                        {ps5Models.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: '12px' }}>
                                <p>Models are loading from database... If empty pending sync.</p>
                                {/* Fallback for visual demo if DB is empty during seed delay */}
                                <button className="btn btn-outline" onClick={() => handleModelSelect({ name: 'PlayStation 5 (Demo)' })}>
                                    Select Demo PS5
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: SELECT ISSUE */}
                {step === 2 && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
                            </button>
                            <h3 style={{ margin: 0 }}>What's wrong with your {selectedModel?.name}?</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {issues.map(issue => (
                                <div
                                    key={issue.id}
                                    onClick={() => {
                                        handleIssueSelect(issue);
                                        setStep(3);
                                    }}
                                    className="card-glass"
                                    style={{
                                        padding: '25px', cursor: 'pointer',
                                        background: selectedIssue?.id === issue.id ? 'var(--bg-element)' : 'var(--bg-surface)',
                                        border: selectedIssue?.id === issue.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                                        textAlign: 'center', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 15px', color: 'var(--primary)'
                                    }}>
                                        <issue.icon size={30} />
                                    </div>
                                    <h4 style={{ marginBottom: '5px' }}>{issue.label}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: SUMMARY & BOOKING */}
                {step === 3 && selectedIssue && (
                    <div className="fade-in" style={{ display: 'flex', gap: '40px', alignItems: 'start', flexWrap: 'wrap' }}>

                        {/* Summary Card */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="card-glass" style={{ padding: '40px', background: 'var(--bg-surface)' }}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
                                    }}>
                                        <CheckCircle size={40} />
                                    </div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>We can fix it!</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>
                                        {selectedModel.name} • {selectedIssue.label}
                                    </p>
                                </div>

                                <div style={{
                                    background: 'var(--bg-body)', padding: '20px', borderRadius: '12px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginBottom: '30px', border: '1px solid var(--border-light)'
                                }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Estimated Price</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {selectedIssue.price > 0 ? `${selectedIssue.price} DKK` : 'Contact Us'}
                                    </span>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '18px', fontSize: '1.1rem', borderRadius: '12px' }}
                                >
                                    Book Repair Appointment <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                                </button>

                                <button
                                    onClick={() => setStep(2)}
                                    style={{
                                        display: 'block', margin: '20px auto 0', background: 'none', border: 'none',
                                        color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline'
                                    }}
                                >
                                    Change Issue
                                </button>
                            </div>
                        </div>

                        {/* Info Side */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3 style={{ marginBottom: '20px' }}>Why choose us?</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <InfoItem title="Same Day Repair" desc="Most console repairs are completed within 24 hours." />
                                <InfoItem title="Original Parts" desc="We use high-quality replacement parts for lasting results." />
                                <InfoItem title="No Fix, No Fee" desc="If we can't fix your console, you don't pay anything." />
                            </ul>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

// Icons helper
const ZapIcon = ({ size, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        {...props}
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const StepIndicator = ({ step, current, icon: Icon, label }) => {
    const isActive = step === current;
    const isCompleted = step < current;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: isActive || isCompleted ? 'var(--primary)' : 'var(--bg-element)',
                color: isActive || isCompleted ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
                border: isActive ? '4px solid rgba(37, 99, 235, 0.2)' : 'none'
            }}>
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
            </div>
            <span style={{
                fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)'
            }}>
                {label}
            </span>
        </div>
    );
};

const ModelCard = ({ model, onClick }) => (
    <div
        onClick={onClick}
        className="card-glass"
        style={{
            padding: '20px', cursor: 'pointer', background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)', borderRadius: '16px',
            textAlign: 'center', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border-light)';
        }}
    >
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0' }}>{model.name}</h4>
    </div>
);

const InfoItem = ({ title, desc }) => (
    <li style={{ display: 'flex', gap: '15px' }}>
        <div style={{ width: '24px', height: '24px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={14} />
        </div>
        <div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
    </li>
);

export default ConsoleRepair;
