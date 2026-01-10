import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Smartphone, Tablet, Watch } from 'lucide-react';
import SearchBox from '../components/SearchBox';
import { useLanguage } from '../context/LanguageContext';

const RepairsIndex = () => {
    const { t } = useLanguage();
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [models, setModels] = useState([]);
    const navigate = useNavigate();

    // Specific brand list order
    const priorityBrands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Huawei', 'LG', 'Motorola', 'Oppo', 'Realme', 'Xiaomi'];

    useEffect(() => {
        axios.get('/api/brands')
            .then(res => {
                const sorted = res.data.sort((a, b) => {
                    const idxA = priorityBrands.indexOf(a.name);
                    const idxB = priorityBrands.indexOf(b.name);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                });
                setBrands(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const fetchModels = (brand) => {
        setSelectedBrand(brand);
        setSelectedFamily(null);
        axios.get(`/api/brands/${brand.id}/models`)
            .then(res => setModels(res.data))
            .catch(err => console.error(err));
    };

    const getFamilies = (models) => {
        if (!models) return [];
        const familiesMap = new Map();

        models.forEach(m => {
            if (m.family && m.family !== 'Other') {
                if (!familiesMap.has(m.family)) {
                    // Determine icon based on family name
                    let icon = <Smartphone size={40} />;
                    if (m.family.includes('Watch')) icon = <Watch size={40} />;
                    else if (m.family.includes('iPad') || m.family.includes('Tablet')) icon = <Tablet size={40} />;

                    familiesMap.set(m.family, { name: m.family, icon });
                }
            }
        });

        return Array.from(familiesMap.values());
    };

    const families = selectedBrand ? getFamilies(models) : [];
    const showFamilies = selectedBrand && families.length > 0 && !selectedFamily;

    const displayedModels = selectedFamily
        ? models.filter(m => m.family === selectedFamily.name)
        : models;

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0' }}>
            <div className="container">

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                        {selectedFamily ? `Vælg din ${selectedFamily.name} model` :
                            selectedBrand ? `Vælg din ${selectedBrand.name} serie` : 'Vælg din enhed'}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        Vi reparerer alle store mærker og modeller. Vælg din enhed for at se priser.
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <SearchBox />
                    </div>
                </div>

                {/* Back Button */}
                {(selectedBrand) && (
                    <button
                        onClick={() => {
                            if (selectedFamily) setSelectedFamily(null);
                            else { setSelectedBrand(null); setModels([]); }
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'none', border: 'none',
                            color: 'var(--primary)', cursor: 'pointer',
                            marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold'
                        }}
                    >
                        <ArrowLeft size={20} /> {selectedFamily ? 'Tilbage til serier' : 'Tilbage til mærker'}
                    </button>
                )}

                {/* Content Grid */}
                {!selectedBrand ? (
                    // BRANDS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                        {brands.map(brand => (
                            <div
                                key={brand.id}
                                onClick={() => fetchModels(brand)}
                                className="card-glass"
                                style={{
                                    padding: '40px 20px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    height: '200px',
                                    background: 'var(--bg-surface)'
                                }}
                            >
                                <img
                                    src={brand.image || `https://placehold.co/100x50?text=${brand.name}`}
                                    alt={brand.name}
                                    className="brand-logo"
                                    onClick={(e) => { e.stopPropagation(); fetchModels(brand); }}
                                />
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.2rem' }}>{brand.name}</span>
                            </div>
                        ))}
                    </div>
                ) : showFamilies ? (
                    // FAMILIES GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {families.map((family, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedFamily(family)}
                                className="card-glass"
                                style={{
                                    padding: '30px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface)'
                                }}
                            >
                                <div style={{
                                    width: '80px', height: '80px',
                                    background: 'var(--bg-element)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '15px',
                                    color: 'var(--primary)'
                                }}>
                                    {family.icon}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{family.name}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    // MODELS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {displayedModels.length > 0 ? displayedModels.map(model => (
                            <div
                                key={model.id}
                                onClick={() => navigate(`/reparation/${model.id}`)}
                                className="card-glass"
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface)'
                                }}
                            >
                                <div style={{
                                    width: '80px', height: '100px',
                                    background: 'var(--bg-element)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <Smartphone size={40} color="var(--text-muted)" strokeWidth={1.5} />
                                </div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '5px' }}>{model.name}</h3>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>Se reparationer</div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                Ingen modeller fundet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairsIndex;
