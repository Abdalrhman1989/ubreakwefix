import React, { useState, useEffect } from 'react';
import { Smartphone, Check, ChevronRight, Truck, ShieldCheck, DollarSign } from 'lucide-react';

const SellDevice = () => {
    // Steps: 0=Select Device, 1=Specs, 2=Condition, 3=Quote/Contact
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // Data Loading
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    // Form Selection
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');

    // Contact Form
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [estimatedPrice, setEstimatedPrice] = useState(0);

    // Initial Load - Fetch Brands
    useEffect(() => {
        fetch('http://localhost:3001/api/brands')
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch Models when Brand changes
    useEffect(() => {
        if (selectedBrand) {
            fetch(`http://localhost:3001/api/brands/${selectedBrand.id}/models`)
                .then(res => res.json())
                .then(data => setModels(data))
                .catch(err => console.error(err));
        }
    }, [selectedBrand]);

    // calculate price whenever params change (MOCK LOGIC)
    useEffect(() => {
        if (selectedModel && selectedCapacity && selectedCondition) {
            // Dummy logic: Base 500 + random model value + capacity * 2 + condition multiplier
            let base = 500;
            if (selectedModel.name.includes('Pro')) base += 1000;
            if (selectedModel.name.includes('Max')) base += 500;
            if (selectedModel.name.includes('Samsung')) base -= 200; // Just example logic

            let capVal = 0;
            if (selectedCapacity === '64GB') capVal = 100;
            if (selectedCapacity === '128GB') capVal = 300;
            if (selectedCapacity === '256GB') capVal = 500;
            if (selectedCapacity === '512GB') capVal = 800;
            if (selectedCapacity === '1TB') capVal = 1200;

            let condMult = 1;
            if (selectedCondition === 'Meget god ✨🙂') condMult = 0.9;
            if (selectedCondition === 'Brugt 🙂') condMult = 0.7;
            if (selectedCondition === 'Fejlbehæftet😔⚠️') condMult = 0.3;

            setEstimatedPrice(Math.floor((base + capVal) * condMult));
        }
    }, [selectedModel, selectedCapacity, selectedCondition]);

    const handleNext = () => {
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullData = {
            deviceModel: `${selectedBrand.name} ${selectedModel.name} ${selectedCapacity} ${selectedColor}`,
            condition: selectedCondition,
            customerName: contactInfo.name,
            customerEmail: contactInfo.email,
            customerPhone: contactInfo.phone,
            estimatedPrice: estimatedPrice
        };

        try {
            const response = await fetch('http://localhost:3001/api/sell-device', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fullData),
            });
            if (response.ok) setSubmitted(true);
            else alert('Fejl ved indsendelse.');
        } catch (err) {
            console.error(err);
            alert('Fejl ved indsendelse.');
        }
    };

    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Sælg Din Mobiltelefon</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Få den bedste pris for din brugte enhed på få minutter.</p>
                    </div>

                    {!submitted ? (
                        <>
                            {/* PROGRESS BAR */} // Optional visualization
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '30px' }}>
                                {[0, 1, 2, 3].map(s => (
                                    <div key={s} style={{ flex: 1, height: '6px', borderRadius: '4px', background: s <= step ? 'var(--primary)' : 'var(--border-light)' }} />
                                ))}
                            </div>

                            <div className="card-glass" style={{ padding: '40px', borderRadius: '24px' }}>

                                {/* STEP 0: SELECT DEVICE */}
                                {step === 0 && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Vælg din enhed</h2>

                                        {!selectedBrand ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
                                                {brands.map(brand => (
                                                    <button key={brand.id} onClick={() => setSelectedBrand(brand)} style={{
                                                        padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)',
                                                        background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                                                    }}>
                                                        <img src={brand.image} alt={brand.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                        <span style={{ fontWeight: '600' }}>{brand.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => { setSelectedBrand(null); setSelectedModel(null); }} style={{ marginBottom: '20px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    ← {selectedBrand.name} (Skift mærke)
                                                </button>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                                    {models.map(model => (
                                                        <button key={model.id} onClick={() => { setSelectedModel(model); handleNext(); }} style={{
                                                            padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)',
                                                            background: selectedModel?.id === model.id ? 'var(--primary)' : 'var(--bg-surface)',
                                                            color: selectedModel?.id === model.id ? 'white' : 'var(--text-main)',
                                                            cursor: 'pointer', textAlign: 'left', fontWeight: '500'
                                                        }}>
                                                            {model.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 1: SPECS (Capacity & Color) */}
                                {step === 1 && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Vælg Specifikationer for {selectedModel.name}</h2>

                                        <div style={{ marginBottom: '30px' }}>
                                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Kapacitet</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'].map(cap => (
                                                    <button key={cap} onClick={() => setSelectedCapacity(cap)} style={{
                                                        padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-light)',
                                                        background: selectedCapacity === cap ? 'var(--primary)' : 'transparent',
                                                        color: selectedCapacity === cap ? 'white' : 'var(--text-main)',
                                                        cursor: 'pointer', fontWeight: '500'
                                                    }}>
                                                        {cap}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '40px' }}>
                                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Farve</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {['GOLD', 'BLACK', 'BLUE', 'PURPLE', 'GREEN', 'SILVER', 'GRAY', 'OTHER'].map(col => (
                                                    <button key={col} onClick={() => setSelectedColor(col)} style={{
                                                        padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-light)',
                                                        background: selectedColor === col ? 'var(--primary)' : 'transparent',
                                                        color: selectedColor === col ? 'white' : 'var(--text-main)',
                                                        cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize'
                                                    }}>
                                                        {col}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button onClick={handleBack} style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-light)', cursor: 'pointer' }}>Tilbage</button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!selectedCapacity || !selectedColor}
                                                style={{
                                                    padding: '12px 30px', borderRadius: '12px',
                                                    background: (!selectedCapacity || !selectedColor) ? 'var(--border-light)' : 'var(--primary)',
                                                    color: 'white', border: 'none', cursor: (!selectedCapacity || !selectedColor) ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                Næste
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: CONDITION */}
                                {step === 2 && (
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Stand</h2>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Er du usikker på enhedens tilstand?</p>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginBottom: '40px' }}>
                                            {[
                                                { label: 'Som ny 😍', desc: 'Ingen ridser eller brugsspor. Ser ud som ny.' },
                                                { label: 'Meget god ✨🙂', desc: 'Minimal slitage. Få usynlige ridser.' },
                                                { label: 'Brugt 🙂', desc: 'Synlige ridser, men ingen revner i skærm/glas.' },
                                                { label: 'Fejlbehæftet😔⚠️', desc: 'Knust skærm, bagside eller andre defekter.' }
                                            ].map(opt => (
                                                <div
                                                    key={opt.label}
                                                    onClick={() => setSelectedCondition(opt.label)}
                                                    style={{
                                                        padding: '20px', borderRadius: '16px', border: `2px solid ${selectedCondition === opt.label ? 'var(--primary)' : 'var(--border-light)'}`,
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px',
                                                        background: selectedCondition === opt.label ? 'rgba(37,99,235,0.05)' : 'transparent'
                                                    }}
                                                >
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${selectedCondition === opt.label ? 'var(--primary)' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {selectedCondition === opt.label && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{opt.label}</h3>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{opt.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button onClick={handleBack} style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-light)', cursor: 'pointer' }}>Tilbage</button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!selectedCondition}
                                                style={{
                                                    padding: '12px 30px', borderRadius: '12px',
                                                    background: !selectedCondition ? 'var(--border-light)' : 'var(--primary)',
                                                    color: 'white', border: 'none', cursor: !selectedCondition ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                Se Tilbud
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: QUOTE & CONTACT */}
                                {step === 3 && (
                                    <div>
                                        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '30px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '10px' }}>VORES TILBUD</h3>
                                            <div style={{ fontSize: '3rem', fontWeight: '800', color: '#10B981', marginBottom: '10px' }}>DKK {estimatedPrice}</div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                Bemærk: Tilbudsprisen er kun gyldig, når vi har inspiceret enheden. Vi forbeholder os retten til at afvise tilbuddet.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Dine oplysninger</h3>
                                            <input
                                                type="text"
                                                placeholder="Navn"
                                                value={contactInfo.name}
                                                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                                required
                                                className="form-input"
                                                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)' }}
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={contactInfo.email}
                                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                required
                                                className="form-input"
                                                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)' }}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Telefon"
                                                value={contactInfo.phone}
                                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                required
                                                className="form-input"
                                                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-light)' }}
                                            />

                                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                                <button type="button" onClick={handleBack} style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-light)', cursor: 'pointer' }}>Tilbage</button>
                                                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '15px', borderRadius: '12px', fontSize: '1.1rem' }}>
                                                    Indsend: Næste
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* HOW IT WORKS SECTION */}
                            <div style={{ marginTop: '80px' }}>
                                <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2rem' }}>Sådan fungerer det</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
                                    {[
                                        { icon: <Smartphone />, title: 'Besøg os', desc: 'Besøg vores hjemmeside og find din enhed for at få prisen.' },
                                        { icon: <ShieldCheck />, title: 'Professionel inspektion', desc: 'Vores teknikere udfører en grundig vurdering af din enheds tilstand.' },
                                        { icon: <Truck />, title: 'Gratis levering', desc: 'Tjek venligst din e-mail for at modtage et gratis forsendelseslabel.' },
                                        { icon: <Truck />, title: 'Send din enhed', desc: 'Pak din enhed sammen med din ordre-ID og send den til vores butik.' },
                                        { icon: <DollarSign />, title: 'Få udbetaling', desc: 'Inden for 7 arbejdsdage fra modtagelsen af din enhed og efter gennemgang overfører vi beløbet til din bankkonto.' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', background: 'var(--bg-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', boxShadow: 'var(--shadow-md)', color: 'var(--primary)' }}>
                                                {item.icon}
                                            </div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{item.title}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ width: '80px', height: '80px', background: '#10B981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', fontSize: '2rem' }}>
                                <Check size={40} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Tak for din henvendelse!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                                Vi har modtaget din forespørgsel. Tjek din email for dit forsendelseslabel og yderligere instruktioner.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellDevice;
