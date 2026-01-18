import React, { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);

    // Parse items if they are JSON string
    let items = [];
    try {
        items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;
    } catch (e) {
        items = [];
    }

    // Status Helper
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#22c55e';
            case 'shipped': return '#3b82f6';
            case 'processing': return '#f59e0b';
            case 'cancelled': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return <CheckCircle size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const statusColor = getStatusColor(order.status);

    // SMART: Determine Display Title
    let displayTitle = `Order #${order.id}`;
    let displayMeta = `${new Date(order.created_at).toLocaleDateString()} • ${items.length} Items`;

    if (order.booking_date) {
        displayMeta = `Booked for ${order.booking_date}`;
        if (order.booking_time) {
            displayMeta += ` at ${order.booking_time}`;
        }
    }

    if (items.length > 0) {
        const first = items[0];
        // For repairs, usually modelName is what we want (e.g. iPhone 13)
        // For shop, name is what we want (e.g. Silicone Case)
        const name = first.modelName
            ? `${first.modelName} ${first.repairName || 'Repair'}`
            : first.name || 'Unknown Item';

        displayTitle = name;
        if (items.length > 1) {
            displayTitle += ` + ${items.length - 1} more`;
        }

        // Move Order ID to meta if not already set by booking date
        if (!order.booking_date) {
            displayMeta = `Order #${order.id} • ${new Date(order.created_at).toLocaleDateString()}`;
        }
    }

    return (
        <div className="card-glass" style={{
            padding: '20px',
            marginBottom: '15px',
            border: `1px solid ${statusColor}30`,
            background: 'var(--bg-surface)'
        }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: `${statusColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: statusColor
                    }}>
                        {order.type === 'repair' ? <Truck size={20} /> : <Package size={20} />}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '2px', fontWeight: 'bold' }}>{displayTitle}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {displayMeta}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right', marginRight: '10px' }}>
                        <div style={{ fontWeight: 'bold' }}>{order.total_amount} DKK</div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: statusColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            justifyContent: 'flex-end'
                        }}>
                            {getStatusIcon(order.status)} {order.status || 'Pending'}
                        </div>
                    </div>
                    {expanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <span style={{
                            background: order.type === 'repair' ? '#e0f2fe' : '#f3e8ff',
                            color: order.type === 'repair' ? '#0369a1' : '#7e22ce',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                        }}>
                            {order.type === 'repair' ? 'Repair' : 'Shop Order'}
                        </span>
                    </div>

                    <h5 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order Items</h5>
                    {items.map((item, idx) => {
                        const qty = item.quantity || 1;
                        const name = item.name || `${item.modelName || ''} ${item.repairName || ''}`.trim() || 'Unknown Item';
                        const price = item.price || 0;

                        return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>{qty}x {name}</span>
                                <span>{price * qty} DKK</span>
                            </div>
                        );
                    })}

                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span>{order.total_amount} DKK</span>
                    </div>

                    {order.return_label_url && (
                        <div style={{ marginTop: '15px' }}>
                            <a href={order.return_label_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                                Hent Returlabel
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderCard;
