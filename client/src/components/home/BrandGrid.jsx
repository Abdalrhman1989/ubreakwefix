import React from 'react';

const brands = [
    'Apple', 'Samsung', 'Google', 'Huawei', 'OnePlus', 'Xiaomi', 'Oppo', 'Motorola', 'Sony', 'LG', 'Nokia', 'Realme'
];

const BrandGrid = () => {
    return (
        <section className="container" style={{ marginBottom: '100px' }}>
            <h2 className="section-title">Eller vælg dit mærke</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                {brands.map((brand) => (
                    <div key={brand} className="hover-card" style={{
                        background: 'white',
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: 'var(--text-dark)'
                    }}>
                        {brand}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BrandGrid;
