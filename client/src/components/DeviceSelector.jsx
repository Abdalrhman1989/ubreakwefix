import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

const DeviceSelector = () => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [repairs, setRepairs] = useState([]);

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    // Fetch Brands on Load
    useEffect(() => {
        axios.get('http://localhost:3001/api/brands')
            .then(res => setBrands(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch Models when Brand changes
    useEffect(() => {
        if (selectedBrand) {
            axios.get(`http://localhost:3001/api/brands/${selectedBrand}/models`)
                .then(res => setModels(res.data))
                .catch(err => console.error(err));
            setSelectedModel('');
            setRepairs([]);
        }
    }, [selectedBrand]);

    // Fetch Repairs when Model changes
    useEffect(() => {
        if (selectedModel) {
            axios.get(`http://localhost:3001/api/models/${selectedModel}/repairs`)
                .then(res => setRepairs(res.data))
                .catch(err => console.error(err));
        } else {
            setRepairs([]);
        }
    }, [selectedModel]);

    return (
        <div className="model-search-box">
            <h3>Find din reparation</h3>

            <div className="form-group">
                <label className="form-label">Mærke</label>
                <select
                    className="form-select"
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                >
                    <option value="">Vælg mærke...</option>
                    {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Model</label>
                <select
                    className="form-select"
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand}
                >
                    <option value="">Vælg model...</option>
                    {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </div>

            {repairs.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '1rem', color: 'var(--primary-blue)' }}>Priser for denne model:</h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {repairs.map(r => (
                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <span style={{ fontWeight: 500 }}>{r.name}</span>
                                <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>kr {r.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                    Book nu <ChevronRight size={18} style={{ marginLeft: '5px' }} />
                </button>
            </div>
        </div>
    );
};

export default DeviceSelector;
