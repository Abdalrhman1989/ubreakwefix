import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const TawkTo = () => {
    const { language } = useLanguage();
    const { user } = useAuth();

    // 1. Handle Script Injection & Language
    useEffect(() => {
        const widgetId = language === 'en' ? '1hnmvcria' : '1hnk825uo';
        const propertyId = '65dd50269131ed19d971f9ee';
        const src = `https://embed.tawk.to/${propertyId}/${widgetId}`;

        // Cleanup function
        const cleanupTawk = () => {
            if (window.Tawk_API) {
                try {
                    if (window.Tawk_API.hideWidget) window.Tawk_API.hideWidget();
                } catch (e) { /* ignore */ }
            }
            const scripts = document.querySelectorAll('script[src*="embed.tawk.to"]');
            scripts.forEach(s => s.remove());
            const tawkElements = document.querySelectorAll('div[class*="tawk"]');
            tawkElements.forEach(el => el.remove());
            const iframes = document.querySelectorAll('iframe[title*="chat"]');
            iframes.forEach(iframe => {
                if (iframe.src.includes('tawk.to')) iframe.remove();
            });

            // Check if we need to reset visitor? Tawk usually persists it in cookies. 
            // We can reset the API object at least.
            window.Tawk_API = {};
            window.Tawk_LoadStart = undefined;
        };

        cleanupTawk();

        // Prepare API Object
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Custom Style to force position "Down"
        window.Tawk_API.customStyle = {
            visibility: 'visible',
            zIndex: 2147483647,
            left: 'auto',
            right: '20px',
            bottom: '20px',
            top: 'auto'
        };

        // Set Visitor Data Initial Load
        if (user) {
            console.log('Tawk.to: Setting visitor data', user);
            window.Tawk_API.visitor = {
                name: String(user.name || 'Visitor'),
                email: String(user.email || 'no-email@example.com')
            };
        }

        // Force Minimize on Load (Small Circle)
        // Note: For "Icon without text", the user MUST select "Bubble" in Tawk Dashboard settings.
        window.Tawk_API.onLoad = function () {
            console.log("Tawk.to Loaded. Minimizing...");
            window.Tawk_API.minimize();
        };

        console.log('Tawk.to: Injecting script', src);
        const script = document.createElement("script");
        script.async = true;
        script.src = src;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        const s0 = document.getElementsByTagName("script")[0];
        s0.parentNode.insertBefore(script, s0);

        return () => {
            cleanupTawk();
        };
    }, [language]); // Only re-inject script if language changes

    // 2. Handle User Updates (Real-time)
    // If user logs in/out *after* script is loaded, we update attributes
    useEffect(() => {
        if (!window.Tawk_API) return;

        if (user && window.Tawk_API.setAttributes) {
            window.Tawk_API.setAttributes({
                name: user.name,
                email: user.email
            }, function (error) { });
        }
        // Note: Tawk doesn't easily support "logging out" (clearing visitor) on the fly without cleanup.
        // But since we cleanup on unmount/remount of language, it's okay. 
        // If user logs out, they usually refresh or we might want to force reset. 
        // For now, this handles the ID update nicely.
    }, [user]);

    return null;
};

export default TawkTo;
