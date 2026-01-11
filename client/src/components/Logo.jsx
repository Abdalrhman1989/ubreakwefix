import React from 'react';

const Logo = ({ size = 40, theme = 'light' }) => {
    // Adjust visual size for dark mode to compensate for potential image padding
    const visualSize = theme === 'dark' ? size * 1.25 : size;

    return (
        <img
            src={theme === 'dark' ? "/logo-dark.png" : "/logo.png"}
            alt="UBreakWeFix Logo"
            style={{
                height: `${visualSize}px`,
                objectFit: 'contain',
                display: 'block'
            }}
        />
    );
};

export default Logo;
