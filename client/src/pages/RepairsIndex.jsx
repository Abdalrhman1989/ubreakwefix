import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Smartphone, Tablet, Watch } from 'lucide-react';
import SearchBox from '../components/SearchBox';
import { useLanguage } from '../context/LanguageContext';

import { Helmet } from 'react-helmet-async';

const RepairsIndex = () => {
    const { t } = useLanguage();
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [models, setModels] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
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

    // Sync state with URL params
    useEffect(() => {
        // Check for slug or ID (backwards compatibility)
        const brandSlugOrId = searchParams.get('brand');
        const familyName = searchParams.get('family');

        if (brandSlugOrId) {
            console.log('DEBUG: Params brand=', brandSlugOrId);
            console.log('DEBUG: Brands available=', brands);

            // Find brand object by slug (preferred) or ID
            const brand = brands.find(b =>
                (b.slug && b.slug === brandSlugOrId) ||
                b.id.toString() === brandSlugOrId
            );
            console.log('DEBUG: Found brand=', brand);

            if (brand) {
                if (selectedBrand?.id !== brand.id) {
                    setSelectedBrand(brand);
                    // Fetch models for this brand
                    axios.get(`/api/brands/${brand.id}/models`)
                        .then(res => setModels(sortModels(res.data)))
                        .catch(err => console.error(err));
                }
            } else {
                // Invalid slug/brand
                setSelectedBrand(null);
                setModels([]);
            }
        } else {
            setSelectedBrand(null);
            setModels([]);
        }

        if (familyName) {
            // Set family object (needs models to be loaded first presumably, or we derive it)
            // We can just set the name for filtering if the object isn't strictly needed for logic, 
            // but we need the object for the icon in the header maybe?
            // For now let's just use the name for filtering since getFamilies derives the objects from models.
        } else {
            setSelectedFamily(null);
        }
    }, [searchParams, brands]); // Re-run when brands load

    // Update selected family object when models/params change
    useEffect(() => {
        const familyName = searchParams.get('family');
        if (familyName && models.length > 0) {
            const availableFamilies = getFamilies(models);
            const family = availableFamilies.find(f => f.name === familyName);
            if (family) setSelectedFamily(family);
        } else if (!familyName) {
            setSelectedFamily(null);
        }
    }, [searchParams, models]);

    const sortModels = (modelsList) => {
        return modelsList.sort((a, b) => {
            const getNum = (str) => {
                // Handling iPhone X variants as generation 10
                if (str.includes('iPhone X')) return 10;

                const match = str.match(/(\d+)/);
                return match ? parseInt(match[0], 10) : 0;
            };

            const numA = getNum(a.name);
            const numB = getNum(b.name);

            if (numA !== numB) {
                return numB - numA; // Descending numeric (Newest first)
            }

            // If generations are equal (e.g. 15 Pro vs 15), sort alphabetically descending
            // This usually places Pro/Max/Ultra (longer/later letters) before standard models
            return b.name.localeCompare(a.name);
        });
    };

    // fetchModels is no longer needed directly, handled by useEffect effects
    // Keeping sortModels helper
    // const fetchModels = (brand) => { ... } - REMOVED

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

    // Generate SEO Metadata
    const getSeoData = () => {
        if (selectedFamily) {
            return {
                title: t('seo.repairsIndex.titleFamily').replace('{family}', selectedFamily.name),
                desc: t('seo.repairsIndex.descFamily').replace('{family}', selectedFamily.name),
                url: `https://ubreakwefix.dk/reparationer?brand=${selectedBrand?.slug || selectedBrand?.id}&family=${selectedFamily.name}`
            };
        }
        if (selectedBrand) {
            return {
                title: t('seo.repairsIndex.titleBrand').replace('{brand}', selectedBrand.name),
                desc: t('seo.repairsIndex.descBrand').replace('{brand}', selectedBrand.name),
                url: `https://ubreakwefix.dk/reparationer?brand=${selectedBrand.slug || selectedBrand.id}`
            };
        }
        return {
            title: t('seo.repairsIndex.title'),
            desc: t('seo.repairsIndex.desc'),
            url: 'https://ubreakwefix.dk/reparationer'
        };
    };

    const seo = getSeoData();

    // Structured Data (BreadcrumbList)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Forside", "item": "https://ubreakwefix.dk/" },
            { "@type": "ListItem", "position": 2, "name": "Reparationer", "item": "https://ubreakwefix.dk/reparationer" }
        ]
    };

    if (selectedBrand) {
        structuredData.itemListElement.push({
            "@type": "ListItem", "position": 3, "name": selectedBrand.name, "item": `https://ubreakwefix.dk/reparationer?brand=${selectedBrand.slug || selectedBrand.id}`
        });
    }

    if (selectedFamily) {
        structuredData.itemListElement.push({
            "@type": "ListItem", "position": 4, "name": selectedFamily.name,
            "item": `https://ubreakwefix.dk/reparationer?brand=${selectedBrand?.slug || selectedBrand?.id}&family=${selectedFamily.name}`
        });
    }

    // Check for thin/empty content
    const shouldNoIndex = selectedBrand && displayedModels.length === 0;

    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh', padding: '40px 0' }}>
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.desc} />
                <link rel="canonical" href={seo.url} />
                {shouldNoIndex && <meta name="robots" content="noindex, follow" />}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <div className="container">

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                        {selectedFamily ? `${t('repairs.selectModel')} (${selectedFamily.name})` :
                            selectedBrand ? `${t('repairs.selectSeries')} (${selectedBrand.name})` : t('repairs.selectDevice')}
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                        {t('repairs.subtitle')}
                    </p>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <SearchBox />
                    </div>
                </div>

                {/* Back Button */}
                {(selectedBrand) && (
                    <Link
                        to={selectedFamily ? `?brand=${selectedBrand.slug || selectedBrand.id}` : '/reparationer'}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'none', border: 'none', textDecoration: 'none',
                            color: 'var(--primary)', cursor: 'pointer',
                            marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold'
                        }}
                    >
                        <ArrowLeft size={20} /> {selectedFamily ? t('repairs.backToSeries') : t('repairs.backToBrands')}
                    </Link>
                )}

                {/* Content Grid */}
                {!selectedBrand ? (
                    // BRANDS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px' }}>
                        {brands.map(brand => (
                            <Link
                                key={brand.id}
                                to={`?brand=${brand.slug || brand.id}`}
                                className="card-glass"
                                style={{
                                    padding: '40px 20px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    height: '200px',
                                    background: 'var(--bg-surface)',
                                    textDecoration: 'none'
                                }}
                            >
                                <img
                                    src={brand.image || `https://placehold.co/100x50?text=${brand.name}`}
                                    alt={brand.name}
                                    className="brand-logo"
                                    style={{ marginBottom: '15px' }}
                                />
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1.2rem' }}>{brand.name}</span>
                            </Link>
                        ))}
                    </div>
                ) : showFamilies ? (
                    // FAMILIES GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {families.map((family, idx) => (
                            <Link
                                key={idx}
                                to={`?brand=${selectedBrand.slug || selectedBrand.id}&family=${family.name}`}
                                className="card-glass"
                                style={{
                                    padding: '30px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface)',
                                    textDecoration: 'none'
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
                            </Link>
                        ))}
                    </div>
                ) : (
                    // MODELS GRID
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                        {displayedModels.length > 0 ? displayedModels.map(model => (
                            <Link
                                key={model.id}
                                to={`/reparation/${model.id}`}
                                className="card-glass"
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    background: 'var(--bg-surface)',
                                    textDecoration: 'none'
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
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{t('repairs.viewRepairs')}</div>
                            </Link>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                {t('repairs.noModels')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairsIndex;
