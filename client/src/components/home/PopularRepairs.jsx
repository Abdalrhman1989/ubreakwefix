import React from 'react';
import { Smartphone, Battery, Zap, SmartphoneNfc, Camera, Speaker, Volume2, Droplets, Stethoscope } from 'lucide-react';

const repairs = [
    { name: 'Skærm', icon: <Smartphone /> },
    { name: 'Batteri', icon: <Battery /> },
    { name: 'Ladestik', icon: <Zap /> },
    { name: 'Bagside', icon: <SmartphoneNfc /> },
    { name: 'Kamera', icon: <Camera /> },
    { name: 'Højtaler', icon: <Speaker /> },
    { name: 'Ørehøjtaler', icon: <Volume2 /> },
    { name: 'Vandskade', icon: <Droplets /> },
    { name: 'Diagnose', icon: <Stethoscope /> },
];

const PopularRepairs = () => {
    return (
        <section className="container" style={{ marginBottom: '100px' }}>
            <h2 className="section-title">Populære reparationer</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
                {repairs.map((r, i) => (
                    <div key={i} className="hover-card" style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid #f1f5f9',
                        cursor: 'pointer'
                    }}>
                        <div style={{ color: 'var(--accent-blue)', marginBottom: '15px' }}>
                            {React.cloneElement(r.icon, { size: 40 })}
                        </div>
                        <div style={{ fontWeight: '600', color: '#334155' }}>{r.name}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PopularRepairs;
