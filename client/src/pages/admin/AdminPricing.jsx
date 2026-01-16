import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronRight, Save, Plus, Trash2, Loader } from 'lucide-react';

const AdminPricing = () => {
    // Data State
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [conditions, setConditions] = useState([]);

    // Selection State
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [storageOptions, setStorageOptions] = useState([]);

    // Matrix State: { "256GB::Som ny": 4500, ... }
    const [matrix, setMatrix] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [newStorage, setNewStorage] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedBrand) {
            axios.get(`/api/brands/${selectedBrand.id}/models`)
                .then(res => setModels(res.data))
                .catch(err => console.error(err));
            setSelectedModel(null);
        }
    }, [selectedBrand]);

    useEffect(() => {
        if (selectedModel) {
            fetchModelDetails(selectedModel.id);
        }
    }, [selectedModel]);

    const fetchInitialData = async () => {
        try {
            const [brandsRes, conditionsRes] = await Promise.all([
                axios.get('/api/brands'),
                axios.get('/api/conditions')
            ]);
            setBrands(brandsRes.data);
            setConditions(conditionsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchModelDetails = async (modelId) => {
        setLoading(true);
        try {
            const [storageRes, matrixRes] = await Promise.all([
                axios.get(`/api/models/${modelId}/storage`),
                axios.get(`/api/models/${modelId}/matrix`)
            ]);
            setStorageOptions(storageRes.data);

            // Convert database rows to lookup object
            const matrixMap = {};
            matrixRes.data.forEach(row => {
                matrixMap[`${row.storage_label}::${row.condition_label}`] = row.price;
            });
            setMatrix(matrixMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStorage = async () => {
        if (!newStorage) return;
        try {
            // We use the existing endpoint, but adjustment is 0/irrelevant now
            await axios.post(`/api/admin/models/${selectedModel.id}/storage`, {
                storage: newStorage,
                adjustment: 0
            });
            setNewStorage('');
            // Refresh details (will re-fetch storage list)
            // We don't want to lose unsaved matrix changes, but adding storage forces a refresh logic usually.
            // Ideally we just append to storageOptions, but let's re-fetch for safety.
            // TODO: Persist matrix state if needed, but for now simplify.
            fetchModelDetails(selectedModel.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteStorage = async (storageId) => {
        if (!window.confirm('Delete this storage option?')) return;
        try {
            await axios.delete(`/api/admin/models/${selectedModel.id}/storage/${storageId}`);
            fetchModelDetails(selectedModel.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePriceChange = (storage, condition, value) => {
        setMatrix(prev => ({
            ...prev,
            [`${storage}::${condition}`]: Number(value)
        }));
    };

    const saveMatrix = async () => {
        setSaving(true);
        // Convert map back to array
        const updates = Object.entries(matrix).map(([key, price]) => {
            const [storage, condition] = key.split('::');
            return {
                model_id: selectedModel.id,
                storage_label: storage,
                condition_label: condition,
                price: price
            };
        });

        if (updates.length === 0) {
            setSaving(false);
            return;
        }

        try {
            await axios.post('/api/admin/pricing/matrix', {
                model_id: selectedModel.id,
                updates
            });
            alert('Prices saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save prices.');
        } finally {
            setSaving(false);
        }
    };

    const filteredModels = models.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="admin-pricing-layout">

            {/* LEFT SIDEBAR: SELECTOR */}
            <div className="pricing-sidebar">
                <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>Select Model</h2>
                    <select
                        value={selectedBrand?.id || ''}
                        onChange={e => setSelectedBrand(brands.find(b => b.id == e.target.value))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', marginBottom: '10px' }}
                    >
                        <option value="">Select Brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>

                    {selectedBrand && (
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input
                                placeholder="Search models..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {!selectedBrand ? (
                        <div style={{ padding: '20px', color: '#9CA3AF', textAlign: 'center' }}>Please select a brand first.</div>
                    ) : (
                        filteredModels.map(model => (
                            <button
                                key={model.id}
                                onClick={() => setSelectedModel(model)}
                                style={{
                                    width: '100%', padding: '15px 20px', textAlign: 'left', background: selectedModel?.id === model.id ? '#EFF6FF' : 'transparent',
                                    border: 'none', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontWeight: selectedModel?.id === model.id ? '600' : '400', color: selectedModel?.id === model.id ? '#2563EB' : '#374151'
                                }}
                            >
                                {model.name}
                                {selectedModel?.id === model.id && <ChevronRight size={16} />}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* MAIN CONTENT: EDITOR */}
            <div className="pricing-main">
                {!selectedModel ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', background: 'white', borderRadius: '12px', border: '2px dashed #E5E7EB' }}>
                        Select a model to edit pricing
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* HEADER */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{selectedModel.name}</h1>
                                <div style={{ color: '#6B7280', marginTop: '4px' }}>Manual Price Matrix</div>
                            </div>
                            <button
                                onClick={saveMatrix}
                                disabled={saving}
                                style={{
                                    background: '#2563EB', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px',
                                    fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: saving ? 0.7 : 1
                                }}
                            >
                                {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Prices
                            </button>
                        </div>

                        {/* CONFIGURATION (Storage Rows) */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '15px' }}>Check configured storages</h3>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {storageOptions.map(opt => (
                                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#F3F4F6', borderRadius: '20px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}>
                                        {opt.storage}
                                        <button onClick={() => handleDeleteStorage(opt.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: 2 }}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input
                                        placeholder="Add Storage (e.g. 128GB)"
                                        value={newStorage}
                                        onChange={e => setNewStorage(e.target.value)}
                                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }}
                                    />
                                    <button onClick={handleAddStorage} style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', width: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></button>
                                </div>
                            </div>
                        </div>

                        {/* MATRIX GRID */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                            {loading ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading prices...</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid #E5E7EB', color: '#6B7280', width: '150px' }}>Storage</th>
                                            {conditions.map(c => (
                                                <th key={c.id} style={{ textAlign: 'center', padding: '16px', borderBottom: '2px solid #E5E7EB', color: '#374151', minWidth: '120px' }}>
                                                    {c.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storageOptions.map(opt => (
                                            <tr key={opt.id}>
                                                <td style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', fontWeight: '600' }}>
                                                    {opt.storage}
                                                </td>
                                                {conditions.map(c => {
                                                    const key = `${opt.storage}::${c.label}`;
                                                    const val = matrix[key] || '';
                                                    return (
                                                        <td key={c.id} style={{ padding: '10px', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>
                                                            <div style={{ position: 'relative' }}>
                                                                <input
                                                                    type="number"
                                                                    value={val}
                                                                    onChange={e => handlePriceChange(opt.storage, c.label, e.target.value)}
                                                                    placeholder="0"
                                                                    style={{
                                                                        width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB',
                                                                        textAlign: 'center', fontWeight: '600', fontSize: '1rem',
                                                                        color: val ? '#10B981' : '#9CA3AF'
                                                                    }}
                                                                />
                                                                <span style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', color: '#D1D5DB', pointerEvents: 'none', fontSize: '0.8rem' }}>kr</span>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                        {storageOptions.length === 0 && (
                                            <tr>
                                                <td colSpan={conditions.length + 1} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                                                    Add storage options above to start setting prices.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPricing;
