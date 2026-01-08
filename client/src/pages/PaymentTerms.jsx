import React from 'react';

const PaymentTerms = () => {
    return (
        <div style={{ padding: '80px 0', minHeight: '80vh', background: 'var(--bg-body)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '60px', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>Betalingsbetingelser</h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>Betalingsmetoder</h3>
                        <p style={{ marginBottom: '20px' }}>
                            På ubreakwefix.dk kan du betale med: <strong>Dankort, Visa, MasterCard, MobilePay, ViaBill.</strong>
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Beløbet trækkes først på dit kort, når varerne sendes fra ubreakwefix.dk.
                            Et beløb større end det, du har godkendt på købstidspunktet, kan aldrig trækkes fra.
                            Der er ingen gebyr for brug af kort.
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>Sikkerhed & Bankoverførsel</h3>
                        <p style={{ marginBottom: '20px' }}>
                            Ved bankoverførsel kontrolleres el. lign. du er ikke beskyttet af oppositionsordningen.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Du accepterer at give aktuelle, fuldstændige og præcise købs- og kontooplysninger for alle køb foretaget via webstedet.
                            Du accepterer desuden straks at opdatere konto- og betalingsoplysninger, herunder e-mailadresse, betalingsmetode
                            og betalingskortets udløbsdato, så vi kan gennemføre dine transaktioner og kontakte dig efter behov.
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>Priser & Gebyrer</h3>
                        <p style={{ marginBottom: '20px' }}>
                            Omsætningsafgift tilføjes til prisen på køb, som det anses for påkrævet af os. Vi kan når som helst ændre priserne.
                            Du accepterer at betale alle gebyrer til de priser, der er gældende for dine køb og eventuelle gældende forsendelsesgebyrer,
                            og du giver os tilladelse til at opkræve din valgte betalingsudbyder for sådanne beløb, når du afgiver din ordre.
                        </p>
                        <p style={{ marginBottom: '20px' }}>
                            Vi forbeholder os retten til at rette eventuelle fejl eller fejl i prisfastsættelsen, selvom vi allerede har anmodet om eller modtaget betaling.
                        </p>

                        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>Forbehold & Annullering</h3>
                        <p style={{ marginBottom: '20px' }}>
                            Vi forbeholder os retten til at nægte enhver ordre, der afgives via webstedet. Vi kan efter eget skøn begrænse eller annullere
                            købte mængder pr. Person, pr. Husstand eller pr. Ordre. Disse begrænsninger kan omfatte ordrer, der er foretaget af eller
                            under den samme kundekonto, den samme betalingsmetode og/eller ordrer, der bruger den samme fakturerings- eller forsendelsesadresse.
                        </p>
                        <p>
                            Vi forbeholder os retten til at begrænse eller forbyde ordrer, der efter vores egen vurdering synes at være placeret
                            af forhandlere, forhandlere eller distributører.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentTerms;
