import React from 'react';

const ShippingPolicy = () => {
    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>Forsendelse og Levering</h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <p style={{ marginBottom: '20px' }}>
                            Ubreakwefix.dk arbejder ubesværet med at sikre, at dine ordrer når sikkert og hurtigt. Lokale leverancer foretages af enten vores egen flåde eller tredjepartsleverandører, der sikrer den bedst mulige service. Se forsendelsesomkostningerne herunder:
                        </p>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '30px', marginBottom: '15px' }}>Forsendelsespriser og Leveringsestimat</h3>
                        <div style={{ background: 'var(--bg-element)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                            <p style={{ marginBottom: '10px' }}><strong>Gratis levering:</strong> Ved ordrer over 500 kr. leverer vi gratis i Danmark (undtagen Færøerne og Grønland) Med PostNord Pakkeboks, PostNord Erhverv, GLS Pakkeshop og GLS Erhverv.</p>
                            <p>Ved ordrer under 500 kr. gælder nedenstående forsendelsespriser.</p>
                        </div>

                        <p style={{ marginBottom: '20px' }}>
                            Når du bestiller varer, kan du forvente, at de sendes samme dag med Post Danmark, hvis de er bestilt inden kl. 17.30 mandag til torsdag og inden kl. 17.00 på fredag. Post Danmark leverer også pakker til papkasser om lørdagen.
                            Med GLS skal de bestilles inden kl. 15.00 mandag til fredag, hvis din ordre skal sendes samme hverdag.
                        </p>

                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '30px', marginBottom: '15px' }}>GLS Leveringsmuligheder</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '1rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-element)', borderBottom: '2px solid var(--border-light)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Leveringstype</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Beskrivelse</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Pris</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>GLS Privat</td>
                                    <td style={{ padding: '12px' }}>Levering til privatadresse</td>
                                    <td style={{ padding: '12px' }}>50,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>GLS Erhverv</td>
                                    <td style={{ padding: '12px' }}>Levering til virksomhedsadresse</td>
                                    <td style={{ padding: '12px' }}>40,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>GLS Pakkeshop</td>
                                    <td style={{ padding: '12px' }}>Afhentning i pakkeshop</td>
                                    <td style={{ padding: '12px' }}>40,00 DKK</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginTop: '30px', marginBottom: '15px' }}>PostNord Leveringsmuligheder</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '1rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-element)', borderBottom: '2px solid var(--border-light)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Leveringstype</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Beskrivelse</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Pris</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>PostNord Privat</td>
                                    <td style={{ padding: '12px' }}>Levering til privatadresse</td>
                                    <td style={{ padding: '12px' }}>60,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>PostNord Erhverv</td>
                                    <td style={{ padding: '12px' }}>Levering til virksomhedsadresse</td>
                                    <td style={{ padding: '12px' }}>55,00 DKK</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '12px' }}>PostNord Pakkeboks</td>
                                    <td style={{ padding: '12px' }}>Afhentning i pakkeboks/postbutik</td>
                                    <td style={{ padding: '12px' }}>55,00 DKK</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '40px', marginBottom: '15px' }}>Ansvar og Forsinkelse</h3>
                        <p style={{ marginBottom: '20px' }}>
                            UBREAK WEFIX er ansvarlig for varerne, indtil du har modtaget dem. Vi leverer fra dag til dag, hvis vi bestiller inden kl. 16.00 på alle hverdage. Imidlertid kan uforudsete fejl, såsom sygdom, forekomme.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Hvis din ordre er mere end 2 hverdage forsinket baseret på ovenstående retningslinjer, bedes du kontakte os via e-mail: support@ubreakwefix.dk og angive dit navn, ordrenummer og dato for ordren.
                        </p>

                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '40px', marginBottom: '15px' }}>Skader og Klager</h3>
                        <p style={{ marginBottom: '20px' }}>
                            <strong>Skader:</strong> Mit websted ubreakwefix.dk er ikke ansvarlig for produkter, der er beskadiget eller tabt under forsendelse. Hvis du modtog din ordre beskadiget, bedes du kontakte transportøren for at indgive et krav.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            <strong>Klage:</strong> Hvis du opdager, at dine produkter er blevet beskadiget under forsendelsen eller har en produktionsfejl, skal du printe en retur fra og returnere produktet + returformularen. Angiv også varenummer og beskrivelse af, hvorfor varen sendes tilbage. Vi dækker eventuelle portoomkostninger.
                        </p>

                        <div style={{ marginTop: '50px', borderTop: '1px solid var(--border-light)', paddingTop: '30px' }}>
                            <p><strong>Kontakt os:</strong> +45 42 34 87 23</p>
                            <p><strong>E-mail:</strong> support@ubreakwefix.dk</p>
                            <p><strong>Adresse:</strong> Skibhusvej 109, Odense 5000, Danmark</p>
                            <p style={{ marginTop: '15px', fontStyle: 'italic', fontSize: '0.9rem' }}>Bemærk: Retur- og refusion politikken gælder kun i Danmark.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
