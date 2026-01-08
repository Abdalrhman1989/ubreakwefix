import React from 'react';
import { Smartphone, Tablet, Laptop, Watch, Gamepad2, Headphones, Monitor } from 'lucide-react';

const categories = [
    { name: 'Smartphone', icon: <Smartphone size={32} /> },
    { name: 'Tablet', icon: <Tablet size={32} /> },
    { name: 'Laptop', icon: <Laptop size={32} /> },
    { name: 'Smartwatch', icon: <Watch size={32} /> },
    { name: 'Konsol', icon: <Gamepad2 size={32} /> },
    { name: 'Audio', icon: <Headphones size={32} /> },
    { name: 'Computer', icon: <Monitor size={32} /> },
];

const CategoryGrid = () => {
    return (
        <section className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, marginBottom: '100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px' }}>
                {categories.map((cat, i) => (
                    <div key={i} className="card-float" style={{
                        padding: '30px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'
                    }}>
                        <div style={{
                            color: 'var(--text-main)',
                            background: '#F3F4F6',
                            width: '60px', height: '60px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = 'var(--text-main)'; }}
                        >
                            {cat.icon}
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>{cat.name}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
