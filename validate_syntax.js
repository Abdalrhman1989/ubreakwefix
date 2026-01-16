const fs = require('fs');
const vm = require('vm');

try {
    const code = fs.readFileSync('./client/src/context/translations.js', 'utf8');
    // Remove 'export' to make it valid in non-module context or just treat it as a script
    // But 'export' is syntax error in script.
    // We can use vm.SourceTextModule if we want to check module syntax, but that's experimental.
    // Easier: replace 'export const' with 'const'.
    const scriptCode = code.replace(/^export const/m, 'const');

    new vm.Script(scriptCode);
    console.log("Syntax is VALID.");
} catch (e) {
    console.log("Syntax is INVALID.");
    console.log(e.message);
    if (e.stack) console.log(e.stack);
}
