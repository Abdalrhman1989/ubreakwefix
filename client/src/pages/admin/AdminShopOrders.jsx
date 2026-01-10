import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, Eye, ShoppingBag, X, Printer, Truck, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AdminShopOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/admin/shop/orders/${id}/status`, { status: newStatus });
            // Optimistic update
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const printInvoice = () => {
        if (!selectedOrder) return;
        const printWindow = window.open('', '_blank');

        let items = [];
        try { items = JSON.parse(selectedOrder.items_json); } catch (e) { items = []; }

        printWindow.document.write(`
            <html>
            <head>
                <title>Invoice #${selectedOrder.id}</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                    .company-info h1 { margin: 0; color: #2563EB; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
                    th { background: #f9f9f9; }
                    .total { font-size: 1.5rem; font-weight: bold; margin-top: 20px; text-align: right; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-info">
                        <h1>UBreak WeFix</h1>
                        <p>Order #${selectedOrder.id}<br>${new Date().toLocaleDateString()}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3>Bill To:</h3>
                        <p>${selectedOrder.customer_name}<br>${selectedOrder.customer_email}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr><th>Item</th><th>Qty</th><th style="text-align: right;">Price</th></tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td style="text-align: right;">${item.price} DKK</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">Total: ${selectedOrder.total_amount} DKK</div>
                <script>window.print();</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', icon: <CheckCircle size={14} /> };
            case 'Shipped': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', icon: <Truck size={14} /> };
            case 'Processing': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', icon: <ShoppingCart size={14} /> }; // ShoppingCart not imported, using default
            case 'Pending': default: return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6B7280', icon: <Clock size={14} /> };
        }
    };

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
                                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => {
                                    let items = [];
                                    try { items = JSON.parse(order.items_json); } catch (e) { items = []; }
                                    const statusStyle = getStatusColor(order.status || 'Pending');

                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '16px', fontWeight: '500' }}>#{order.id}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '500' }}>{order.customer_name}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.customer_email}</div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                    {items.length} items
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', fontWeight: 'bold' }}>{order.total_amount} DKK</td>
                                            <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                                                {order.created_at ? format(new Date(order.created_at), 'MMM dd, HH:mm') : 'N/A'}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <select
                                                    value={order.status || 'Pending'}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        border: 'none',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <button
                                                    onClick={() => openOrderDetails(order)}
                                                    className="btn-icon"
                                                    style={{ color: 'var(--primary)' }}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div className="card-glass" style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-surface)', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Order #{selectedOrder.id}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Customer</h4>
                                    <p style={{ fontWeight: '500' }}>{selectedOrder.customer_name}</p>
                                    <p style={{ fontSize: '0.875rem' }}>{selectedOrder.customer_email}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Order Info</h4>
                                    <p style={{ fontSize: '0.875rem' }}>Date: {format(new Date(selectedOrder.created_at), 'PPP pp')}</p>
                                    <p style={{ fontSize: '0.875rem' }}>Status: <span style={{ fontWeight: '600' }}>{selectedOrder.status}</span></p>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Items</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                {(() => {
                                    try {
                                        return JSON.parse(selectedOrder.items_json).map((item, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-element)', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <div style={{ width: '24px', height: '24px', background: 'var(--bg-body)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {item.quantity}
                                                    </div>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span style={{ fontWeight: '500' }}>{item.price} DKK</span>
                                            </div>
                                        ));
                                    } catch (e) { return <div>Error parsing items</div>; }
                                })()}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{selectedOrder.total_amount} DKK</span>
                            </div>
                        </div>

                        <div style={{ padding: '20px', background: 'var(--bg-element)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '8px' }}>
                                Close
                            </button>
                            <button onClick={printInvoice} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
                                <Printer size={18} /> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShopOrders;
