const nodemailer = require('nodemailer');

// Configure this with your actual email provider
// For Gmail: use 'gmail' service and an App Password (not your login password)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'hotmail', 'yahoo', or host: 'smtp.example.com'
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Helper to send email
const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER) {
            console.log("==================================================");
            console.log(`[MOCK EMAIL] To: ${to}`);
            console.log(`[MOCK EMAIL] Subject: ${subject}`);
            console.log(`[MOCK EMAIL] Body: ${html}`);
            console.log("==================================================");
            return { success: true, mocked: true };
        }

        await transporter.sendMail({
            from: '"UBreak WeFix" <support@ubreakwefix.dk>',
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error: error.message };
    }
};

const sendBookingConfirmation = async (booking) => {
    const subject = `Orderbekræftelse #${booking.id} - UBreak WeFix`;
    const html = `
        <h1>Tak for din bestilling, ${booking.customer_name}!</h1>
        <p>Vi har modtaget din booking.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h3>Ordre Detaljer</h3>
            <p><strong>Enhed:</strong> ${booking.device_model}</p>
            <p><strong>Problem:</strong> ${booking.problem}</p>
            <p><strong>Dato:</strong> ${booking.booking_date}</p>
        </div>

        <p>Du vil modtage en besked når din enhed er klar.</p>
        <p>Med venlig hilsen,<br>UBreak WeFix Teamet</p>
    `;
    return sendEmail(booking.customer_email, subject, html);
};

const sendStatusUpdate = async (booking, newStatus) => {
    const subject = `Opdatering på din reparation #${booking.id} - ${newStatus}`;
    let message = "";

    switch (newStatus) {
        case 'In Progress':
            message = "Vi er nu gået i gang med at reparere din enhed.";
            break;
        case 'Completed':
            message = "Gode nyheder! Din enhed er repareret og klar til afhentning.";
            break;
        case 'Cancelled':
            message = "Din booking er blevet annulleret. Kontakt os venligst for mere information.";
            break;
        default:
            message = `Status på din ordre er nu: ${newStatus}`;
    }

    const html = `
        <h1>Hej ${booking.customer_name}</h1>
        <p>${message}</p>
        
        <div style="background: #e5e7eb; padding: 15px; margin: 20px 0;">
            <strong>Nuværende Status:</strong> <span style="color: #2563EB; font-weight: bold;">${newStatus}</span>
        </div>

        <p>Tak fordi du valgte os.</p>
    `;
    return sendEmail(booking.customer_email, subject, html);
};

const sendNewApplicationNotification = async (application) => {
    const subject = `Ny Erhvervsansøgning: ${application.company_name}`;
    const html = `
        <h1>Ny Ansøgning om Erhvervskonto</h1>
        <p>En ny virksomhed har ansøgt om en B2B konto.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h3>Virksomhedsinfo</h3>
            <p><strong>Virksomhed:</strong> ${application.company_name}</p>
            <p><strong>CVR:</strong> ${application.cvr}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Telefon:</strong> ${application.phone}</p>
            <p><strong>Adresse:</strong> ${application.address}</p>
        </div>

        <p><a href="http://localhost:5173/admin/business-requests" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Gå til Admin Panel</a></p>
    `;
    // Send to admin email
    return sendEmail('ubreakwefixodense@gmail.com', subject, html);
};

const sendBusinessApprovalEmail = async (user, password) => {
    const subject = `Velkommen til UBreak WeFix Erhverv`;
    const html = `
        <h1>Din erhvervskonto er godkendt!</h1>
        <p>Hej ${user.name},</p>
        <p>Vi er glade for at kunne byde jer velkommen som erhvervskunde hos UBreak WeFix.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0;">
            <h3>Dine Login Oplysninger</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Midlertidig Adgangskode:</strong> ${password}</p>
        </div>

        <p>Du kan nu logge ind på vores B2B portal og se dine fordelspriser.</p>
        <p><a href="http://localhost:5173/login" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Log ind nu</a></p>
    `;
    return sendEmail(user.email, subject, html);
};

const sendBusinessRejectionEmail = async (email, companyName) => {
    const subject = `Vedr. din ansøgning til UBreak WeFix Erhverv`;
    const html = `
        <h1>Status på din ansøgning</h1>
        <p>Hej ${companyName},</p>
        <p>Vi har modtaget jeres ansøgning om en erhvervskonto.</p>
        <p>Desværre kan vi ikke godkende jeres ansøgning på nuværende tidspunkt.</p>
        <p>I er velkomne til at kontakte os for yderligere information.</p>
    `;
    return sendEmail(email, subject, html);
};

module.exports = {
    sendBookingConfirmation,
    sendStatusUpdate,
    sendNewApplicationNotification,
    sendBusinessApprovalEmail,
    sendBusinessRejectionEmail
};
