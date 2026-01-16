const fs = require('fs');
const vm = require('vm');

try {
    const code = fs.readFileSync('./client/src/context/translations.js', 'utf8');
    const scriptCode = code.replace(/^export const/m, 'const');

    const context = { console };
    vm.createContext(context);
    new vm.Script(scriptCode).runInContext(context);

    const t = context.translations;
    console.log('Keys in translations:', Object.keys(t));
    if (t.da) {
        console.log('Keys in translations.da:', Object.keys(t.da));
        console.log('Does da have shippingPolicy?', !!t.da.shippingPolicy);
    } else {
        console.log('translations.da is missing!');
    }

    if (t.en) {
        console.log('Keys in translations.en:', Object.keys(t.en));
        console.log('Does en have shippingPolicy?', !!t.en.shippingPolicy);
    } else {
        console.log('translations.en is missing!');
    }

    // Check if shippingPolicy is at root
    if (t.shippingPolicy) {
        console.log('shippingPolicy IS AT ROOT (sibling of da/en)!');
    }

} catch (e) {
    console.log("Error:", e.message);
}
