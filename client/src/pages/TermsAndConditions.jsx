import React from 'react';

const TermsAndConditions = () => {
    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>Handelsbetingelser</h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>

                        {/* 1. General Info */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>Generelle oplysninger om virksomheden</h3>
                            <p><strong>Virksomhedens kaldenavn:</strong> You Break We Fix (Ubreak We Fix)</p>
                            <p><strong>Adresse:</strong> Skibhusvej 109 St, Tv - Odense 5000 - Danmark</p>
                            <p><strong>CVR-nummer:</strong> DK 38804596</p>
                            <p><strong>Officiel Mailadresse:</strong> support@ubreakwefix.dk</p>
                            <p><strong>Officiel web-adresse:</strong> www.ubreakwefix.dk</p>
                            <p><strong>Telefonnummer:</strong> +45 42 34 87 23</p>
                            <p><strong>Etableringsår:</strong> 2020</p>
                        </section>

                        {/* 2. Privacy Policy */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>Persondatapolitik</h3>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Registrering af personoplysninger:</strong> For at indgå en aftale med os via websitet, kræves følgende personlige oplysninger:
                                <br />Navn, Adresse, Telefonnummer, E-mailadresse.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                Disse oplysninger transmitteres og opbevares ikke krypteret.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Opbevaring og anvendelse af oplysninger:</strong> Personoplysningerne i forbindelse med dit køb registreres hos Ubreak Wefix og opbevares i 3 år for at sikre korrekt behandling ved eventuelle garantisager, hvorefter oplysningerne slettes. Formålet med registreringen af personoplysninger er at kunne levere varen til dig.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Samtykke og information om indsamling:</strong> Indsamling af personoplysninger via vores website sker altid med dit udtrykkelige samtykke, hvor du informeres om hvilke oplysninger der indsamles og hvorfor.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Adgang til oplysninger:</strong> Alle ansatte i virksomheden har adgang til de oplysninger, der registreres om dig.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Brug af oplysninger:</strong> Dine oplysninger anvendes kun til forsendelse af varen og til at informere om eventuelle problemer med leveringen. Efter en bestilling modtager du en ordrebekræftelse via e-mail.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Videregivelse af oplysninger:</strong> Som en selvstændig online butik, videregiver vi ikke dine personoplysninger til andre. Dine data opbevares sikkert men ukrypteret.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Rettigheder som registreret:</strong> Som registreret hos Ubreak Wefix har du ret til at gøre indsigelse mod registreringen og ret til indsigt i de oplysninger, der er registreret om dig. Disse rettigheder er sikret efter persondataloven.
                            </p>
                        </section>

                        {/* 3. B2B Terms */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>Betingelser For Erhvervskøb</h3>
                            <p style={{ marginBottom: '15px' }}><strong>Identifikation som Erhvervskunde:</strong> Når du placerer en ordre hos Ubreak Wefix og oplyser et CVR-nummer og virksomhedsnavn i faktureringsadressen, anses du automatisk som erhvervskunde.</p>

                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '10px' }}>Særlige Vilkår for Erhvervskunder:</h4>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
                                <li style={{ marginBottom: '10px' }}><strong>Fortrydelsesret:</strong> Erhvervskunder har ikke en almindelig fortrydelsesret på deres køb.</li>
                                <li style={{ marginBottom: '10px' }}><strong>Reklamationsret:</strong> Vi tilbyder en reklamationsret på 12 måneder på alle produkter købt som erhvervskunde.</li>
                                <li style={{ marginBottom: '10px' }}><strong>Fragt ved Reklamation:</strong> Ved reklamationssager pålægges fragtomkostningerne erhvervskunden.</li>
                                <li style={{ marginBottom: '10px' }}><strong>Levering:</strong> Alle erhvervskøb leveres med omdeling. Der vil være fragtomkostninger uanset ordrestørrelse.</li>
                                <li style={{ marginBottom: '10px' }}><strong>Betaling:</strong> Betaling med Dankort tilbydes gebyrfrit for erhvervskunder.</li>
                            </ul>
                        </section>

                        {/* 4. Updates */}
                        <section style={{ marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '15px' }}>Forbehold for Ændringer</h3>
                            <p style={{ marginBottom: '15px' }}>
                                Hos Ubreak We Fix er vi forpligtet til kontinuerligt at forbedre og opdatere vores serviceydelser.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                UBREAK WE FIX forbeholder sig retten til, når som helst, at foretage ændringer eller opdateringer i de betingelser og regler, der gælder for vores hjemmeside og services.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                <strong>Seneste Opdatering:</strong> Denne politik blev senest opdateret og er gældende fra 18 Sep 2024.
                            </p>
                        </section>

                        {/* 5. Withdrawal Form */}
                        <section style={{ marginBottom: '40px', background: 'var(--bg-element)', padding: '30px', borderRadius: '12px' }}>
                            <h3 style={{ color: 'var(--text-main)', fontSize: '1.4rem', marginBottom: '20px' }}>Fortrydelsesformular</h3>
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '20px' }}>
                                (Denne formular er kun gyldig, hvis du ønsker at benytte din ret til at fortryde et køb)
                            </p>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>Til:</strong><br />
                                Ubreak Wefix<br />
                                Skibhusvej 109 st, tv<br />
                                Odense - 5000 - Danmark<br />
                                support@ubreakwefix.dk
                            </div>

                            <p style={{ marginBottom: '15px' }}>
                                <strong>Erklæring om fortrydelse:</strong><br />
                                Hermed meddeles det, at jeg ønsker at benytte min ret til at fortryde købsaftalen for nedenstående produkt(er) eller service(ydelser):
                            </p>

                            <div style={{ paddingLeft: '20px', borderLeft: '3px solid var(--border-light)', marginBottom: '20px' }}>
                                <p>Detaljer om produkt: ____________________________________</p>
                                <p>Detaljer om Service(ydelser): _____________________________</p>
                                <p>Dato for bestilling: _______________________________________</p>
                                <p>Dato for modtagelse: _____________________________________</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>Forbrugerens detaljer:</strong><br />
                                Navn: ____________________________________________________<br />
                                Adresse: _________________________________________________
                            </div>

                            <div>
                                <strong>Bekræftelse:</strong><br /><br />
                                Underskrift: ________________________________________<br /><br />
                                Dato: _______________________________________________
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
