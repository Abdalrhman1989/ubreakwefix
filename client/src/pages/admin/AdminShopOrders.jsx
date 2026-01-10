import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, Eye, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

const AdminShopOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin/shop/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Shop Orders</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and view customer purchases</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        style={{ paddingLeft: '40px', width: '300px' }}
                    />
                </div>
            </div>

            <div className="card-glass" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Order ID</th>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Customer</th>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Items</th>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Total</th>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => {
                                    let items = [];
                                    try {
                                        items = JSON.parse(order.items_json);
                                    } catch (e) {
                                        items = [];
                                    }

                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '16px', fontWeight: '500' }}>#{order.id}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500' }}>{order.customer_name}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {items.map((item, idx) => (
                                                        <div key={idx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <div style={{ width: '20px', height: '20px', background: 'var(--bg-element)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                                                {item.quantity}x
                                                            </div>
                                                            <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', fontWeight: 'bold' }}>{order.total_amount} DKK</td>
                                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                                                {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy HH:mm') : 'N/A'}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '999px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    color: '#10B981'
                                                }}>
                                                    Completed
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminShopOrders;
