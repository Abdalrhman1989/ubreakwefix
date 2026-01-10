import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, User, Phone, Wrench, Printer, Mail, FileText } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = () => {
        axios.get('/api/admin/bookings').then(res => setBookings(res.data));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`/api/admin/bookings/${id}/status`, { status: newStatus });
            fetchBookings();
            // Optional: You could show a toast here instead of alerts to be more professional
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669' };
            case 'In Progress': return { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563EB' };
            case 'Cancelled': return { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626' };
            default: return { bg: 'rgba(217, 119, 6, 0.1)', text: '#D97706' };
        }
    };

    const handlePrintInvoice = (booking) => {
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(`
            <html>
            <head>
                <title>Invoice #${booking.id}</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                    .company-info h1 { margin: 0; color: #2563EB; }
                    .invoice-details { text-align: right; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-weight: bold; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 10px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
                    th { background: #f9f9f9; }
                    .total { font-size: 1.2rem; font-weight: bold; margin-top: 20px; text-align: right; }
                    .footer { margin-top: 50px; text-align: center; font-size: 0.8rem; color: #999; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-info">
                        <h1>UBreak WeFix</h1>
                        <p>Nørrebrogade 123<br>2200 Copenhagen N<br>CVR: 12345678</p>
                    </div>
                    <div class="invoice-details">
                        <h2>INVOICE</h2>
                        <p><strong>Invoice No:</strong> #${booking.id}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${booking.status || 'Pending'}</p>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Bill To</div>
                    <p><strong>${booking.customer_name}</strong><br>
                    ${booking.customer_email}<br>
                    ${booking.customer_phone}</p>
                </div>

                <div class="section">
                    <div class="section-title">Order Details</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Model</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${booking.problem}</td>
                                <td>${booking.device_model}</td>
                                <td style="text-align: right;">-</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="font-style: italic; font-size: 0.9rem; margin-top: 10px; color: #666;">* Final price determined upon repair completion.</p>
                </div>

                <div class="footer">
                    <p>Thank you for choosing UBreak WeFix!</p>
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `);
        invoiceWindow.document.close();
    };

    const handleEmailCustomer = (booking) => {
        window.location.href = `mailto:${booking.customer_email}?subject=Regarding your repair order #${booking.id}&body=Hi ${booking.customer_name},%0D%0A%0D%0AWe are writing regarding your device (${booking.device_model})...`;
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '30px' }}>Bookings & Orders</h1>

            <div className="card-glass" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--bg-element)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Customer</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Device & Issue</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {bookings.length > 0 ? bookings.map(booking => {
                            const colors = getStatusColor(booking.status);
                            return (
                                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>#{booking.id}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '500' }}>{booking.customer_name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.customer_email}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.customer_phone}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: '500' }}>{booking.device_model}</div>
                                        <div style={{ color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{booking.problem}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>{booking.booking_date}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <select
                                            value={booking.status || 'Pending'}
                                            onChange={(e) => updateStatus(booking.id, e.target.value)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                background: colors.bg,
                                                color: colors.text
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handlePrintInvoice(booking)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                                                title="Print Invoice"
                                            >
                                                <Printer size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEmailCustomer(booking)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                                                title="Send Email"
                                            >
                                                <Mail size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
