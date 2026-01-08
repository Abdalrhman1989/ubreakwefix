import React from 'react';
import { Link } from 'react-router-dom';

const TopBar = () => {
    return (
        <div style={{ background: 'var(--primary-blue)', color: 'white', fontSize: '0.85rem', padding: '8px 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', fontWeight: '500' }}>
                    <span>★ Quality repairs</span>
                    <span>★ Fast service</span>
                    <span>★ Warranty included</span>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/om-os" className="hover-text">Om os</Link>
                    <Link to="/erhverv" className="hover-text">Erhverv</Link>
                    <Link to="/kontakt" className="hover-text">Kontakt</Link>
                </div>
            </div>
            <style>{`
                .hover-text { opacity: 0.9; text-decoration: none; color: white; transition: opacity 0.2s; }
                .hover-text:hover { opacity: 1; text-decoration: underline; }
                @media (max-width: 768px) {
                    .container { flex-direction: column; gap: 5px; text-align: center; }
                }
            `}</style>
        </div>
    );
};

export default TopBar;
