import React from 'react';
import { Briefcase, Zap, Receipt, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Business = () => {
    return (
        <div style={{ padding: '80px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>ERHVERVSAFTALE</span>
                    <h1 className="title-hero" style={{ fontSize: '3rem', margin: '20px 0' }}>Hold din virksomhed kørende</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                        Få en skræddersyet erhvervsaftale med faste lave priser, prioritering og månedlig fakturering.
                    </p>
                    <Link to="/erhverv/opret" className="btn btn-primary" style={{ marginTop: '30px', textDecoration: 'none' }}>Opret erhvervskonto</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                    {[
                        { icon: <Zap />, title: 'Prioriteret Service', desc: 'Jeres enheder kommer forrest i køen. Ingen ventetid.' },
                        { icon: <Receipt />, title: 'Månedlig Faktura', desc: 'Samlet fakturering for alle reparationer. Nemt bogholderi.' },
                        { icon: <Briefcase />, title: 'Hente-binge service', desc: 'Vi henter og bringer enheder i lokalområdet.' },
                        { icon: <Users />, title: 'Personlig Kontakt', desc: 'Fast kontaktperson der kender jeres behov.' }
                    ].map((item, i) => (
                        <div key={i} className="card-float" style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                                {React.cloneElement(item.icon, { size: 40 })}
                            </div>
                            <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Business;
