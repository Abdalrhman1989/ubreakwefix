import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Smartphone, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ServiceCards = () => {
    const { t } = useLanguage();

    return (
        <section style={{ padding: '80px 0', background: 'var(--bg-body)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Card 1: Reparation */}
                    <Link to="/reparationer" style={{ textDecoration: 'none' }}>
                        <div className="card-hover" style={{
                            background: 'linear-gradient(135deg, #0BA5E9 0%, #2563EB 100%)',
                            borderRadius: '24px',
                            height: '220px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '40px',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '10px', borderRadius: '12px', marginBottom: '15px' }}>
                                    <Wrench size={32} color="white" />
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{t('serviceCards.repair.title')}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '5px' }}>{t('serviceCards.repair.desc')}</p>
                            </div>
                            {/* Decorative Circle */}
                            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400" alt="Repair" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '60%', objectFit: 'cover', maskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', opacity: 0.5 }} />
                        </div>
                    </Link>

                    {/* Card 2: Sælg Din Mobiltelefon */}
                    <Link to="/saelg-enhed" style={{ textDecoration: 'none' }}>
                        <div className="card-hover" style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            borderRadius: '24px',
                            height: '220px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '40px',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '10px', borderRadius: '12px', marginBottom: '15px' }}>
                                    <Smartphone size={32} color="white" />
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{t('serviceCards.sellPhone.title')}</h2>
                            </div>
                            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400" alt="Sell Phone" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '50%', objectFit: 'cover', maskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', opacity: 0.6 }} />
                        </div>
                    </Link>

                    {/* Card 3: Sælg Din Ødelagte Skærm */}
                    <Link to="/saelg-skaerm" style={{ textDecoration: 'none' }}>
                        <div className="card-hover" style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                            borderRadius: '24px',
                            height: '220px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '40px',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '10px', borderRadius: '12px', marginBottom: '15px' }}>
                                    <Layers size={32} color="white" />
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{t('serviceCards.sellScreen.title')}</h2>
                            </div>
                            <img src="https://images.unsplash.com/photo-1605236453806-6ff36a86fa83?auto=format&fit=crop&q=80&w=400" alt="Broken Screen" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '60%', objectFit: 'cover', maskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))', opacity: 0.5 }} />
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default ServiceCards;
