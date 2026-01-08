import React from 'react';

const Logo = ({ size = 28 }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1 }}>
            <span style={{ color: 'var(--primary)' }}>U</span>
            <span style={{ color: 'var(--text-main)' }}>break</span>
            <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>We</span>
            <span style={{ color: 'var(--text-main)' }}>fix</span>
        </div>
    );
};

export default Logo;
