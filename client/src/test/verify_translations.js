
import { translations } from '../context/translations.js';

console.log('--- Translations Debug ---');
console.log('Type of translations:', typeof translations);
console.log('Keys in translations:', Object.keys(translations));

if (translations.da) {
    console.log('Keys in da:', Object.keys(translations.da));
    if (translations.da.contactPage) {
        console.log('Keys in da.contactPage:', Object.keys(translations.da.contactPage));
        console.log('da.contactPage.form.name:', translations.da.contactPage.form?.name);
    } else {
        console.error('MISSING: da.contactPage');
    }
} else {
    console.error('MISSING: translations.da');
}

if (translations.en) {
    console.log('Keys in en:', Object.keys(translations.en));
    if (translations.en.contactPage) {
        console.log('Keys in en.contactPage:', Object.keys(translations.en.contactPage));
    } else {
        console.error('MISSING: en.contactPage');
    }
} else {
    console.error('MISSING: translations.en');
}

// Test t function logic
const language = 'da';
const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || key;
};

console.log("t('contactPage.form.name') result:", t('contactPage.form.name'));
