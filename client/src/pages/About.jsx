// This tool call is actually to update translations.js first. 
// I will output a replacement for translations.js to add the About page content.
// Wait, I can't change the tool call target here.
// I will return "NO CHANGE" effectively by not making the call and switching to translations.js update.
// Actually I must make a valid call or switch tool.
// I will update translations.js in the next step.
// For now, I will just import useLanguage hook in About.jsx to be ready.
import { useLanguage } from '../context/LanguageContext';
import MapSection from '../components/MapSection';
import TrustSection from '../components/home/TrustSection';

const About = () => {
    const { t } = useLanguage();
    return (
        <div style={{ background: 'var(--bg-body)', minHeight: '100vh' }}>
            {/* Header / Hero */}
            <div style={{
                background: 'var(--bg-surface)',
                padding: '100px 0',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>{t('about.title')}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
                        {t('about.subtitle')}
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '80px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>

                    {/* Text Section */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>{t('about.missionTitle')}</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px', fontSize: '1.1rem' }}>
                            {t('about.missionText')}
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px', fontSize: '1.1rem' }}>
                            {t('about.missionText2')}
                        </p>

                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>{t('about.valuesTitle')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { title: t('about.valQuality'), desc: t('about.valQualityDesc') },
                                { title: t('about.valTransparency'), desc: t('about.valTransparencyDesc') },
                                { title: t('about.valSustainability'), desc: t('about.valSustainabilityDesc') }
                            ].map((val, i) => (
                                <li key={i} style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary)' }}>{val.title}:</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{val.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Section */}
                    <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <img
                                src="/hero-3d.png"
                                alt="Innovation and Repair"
                                style={{ width: '100%', display: 'block' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, width: '100%',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'white'
                            }}>
                                <div style={{ fontWeight: 'bold' }}>UBreak WeFix Lab</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Professional Service</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAP SECTION */}
            <MapSection />

            {/* Re-use Trust Section */}
            <TrustSection />
        </div>
    );
};

export default About;
