require('dotenv').config({ path: './server/.env' });

console.log("Checking Environment Variables...");
console.log("EMAIL_USER set:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS set:", !!process.env.EMAIL_PASS);
if (process.env.EMAIL_USER) {
    console.log("EMAIL_USER value:", process.env.EMAIL_USER.substring(0, 3) + "***");
}
console.log("Current Directory:", process.cwd());
