try {
    const fs = require('fs');
    const content = fs.readFileSync('./client/src/context/translations.js', 'utf8');
    // Replace export with nothing to make it valid JS for node to just parse, 
    // or better, just create a dummy "export" and "const"
    // But "export" is module syntax.
    // I'll manually check brace balance.

    let open = 0;
    let stack = [];

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '{') {
                open++;
                stack.push(i + 1);
            } else if (char === '}') {
                open--;
                if (open < 0) {
                    console.log(`Error: Extra closing brace at line ${i + 1}`);
                    process.exit(1);
                }
                stack.pop();
            }
        }
    }

    if (open > 0) {
        console.log(`Error: Unclosed brace somewhere. Stack (last 5 opens): ${stack.slice(-5).join(', ')}`);
        process.exit(1);
    } else {
        console.log("Braces are balanced!");
    }

} catch (e) {
    console.error(e);
}
