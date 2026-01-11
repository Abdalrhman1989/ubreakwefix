import React from 'react';

const Logo = ({ size = 40 }) => {
    return (
        <img
            src="/logo.png"
            alt="UBreakWeFix Logo"
            style={{
                height: `${size}px`,
                objectFit: 'contain',
                display: 'block'
            }}
        />
    );
};

export default Logo;
