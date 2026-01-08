import React from 'react';

const Stepper = ({ currentStep = 1 }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0', opacity: 0.9 }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px', height: '40px',
                    background: currentStep >= 1 ? 'var(--primary)' : '#E2E8F0',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', margin: '0 auto 8px'
                }}>1</div>
                <div style={{ fontSize: '0.85rem', color: currentStep >= 1 ? '#333' : '#999' }}>Vælg enhed</div>
            </div>

            {/* Line */}
            <div style={{ width: '100px', height: '4px', background: currentStep >= 2 ? 'var(--primary)' : '#E2E8F0', margin: '0 10px 20px' }}></div>

            {/* Step 2 */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px', height: '40px',
                    background: currentStep >= 2 ? 'var(--primary)' : '#E2E8F0',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', margin: '0 auto 8px'
                }}>2</div>
                <div style={{ fontSize: '0.85rem', color: currentStep >= 2 ? '#333' : '#999' }}>Vælg reparation</div>
            </div>

            {/* Line */}
            <div style={{ width: '100px', height: '4px', background: currentStep >= 3 ? 'var(--primary)' : '#E2E8F0', margin: '0 10px 20px' }}></div>

            {/* Step 3 */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px', height: '40px',
                    background: currentStep >= 3 ? 'var(--primary)' : '#E2E8F0',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', margin: '0 auto 8px'
                }}>3</div>
                <div style={{ fontSize: '0.85rem', color: currentStep >= 3 ? '#333' : '#999' }}>Færdiggør Ordre</div>
            </div>
        </div>
    );
};

export default Stepper;
