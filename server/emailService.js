const nodemailer = require('nodemailer');
const path = require('path');

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

        const mailOptions = {
            from: '"UBreak WeFix" <support@ubreakwefix.dk>',
            to,
            subject,
            html,
            attachments
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error: error.message };
    }
};

// Helper to format date for ICS
const formatDateForICS = (dateStr) => {
    // Assuming dateStr matches YYYY-MM-DD (plus time potentially)
    if (!dateStr) return '';
    const numeric = dateStr.replace(/[-: ]/g, ''); // Remove non-numeric
    return numeric.substring(0, 8) + 'T090000'; // Default start logic if exact format varies
};

// Logo Path
const logoPath = path.join(__dirname, '../client/public/logo.png');
const logoAttachment = {
    filename: 'logo.png',
    path: logoPath,
    cid: 'logo' // Referenced as cid:logo
};

const sendBookingConfirmation = async (booking, language = 'da') => {
    const isEn = language === 'en';

    const texts = {
        subject: isEn ? `Order Confirmation #${booking.id} - UBreak WeFix` : `Orderbekræftelse #${booking.id} - UBreak WeFix`,
        title: isEn ? `Thank you for your booking, ${booking.customer_name}!` : `Tak for din bestilling, ${booking.customer_name}!`,
        received: isEn ? `We have received your booking #${booking.id}.` : `Vi har modtaget din booking #${booking.id}.`,
        detailsHeader: isEn ? `Order Details` : `Ordre Detaljer`,
        deviceLabel: isEn ? `Device:` : `Enhed:`,
        problemLabel: isEn ? `Problem:` : `Problem:`,
        dateLabel: isEn ? `Date:` : `Dato:`,
        googleBtn: isEn ? `Add to Google Calendar` : `Tilføj til Google Kalender`,
        iosHint: isEn ? `(iOS users: Open the attached file)` : `(iOS brugere: Åbn den vedhæftede fil)`,
        closing: isEn ? `We look forward to seeing you in the shop.` : `Vi glæder os til at se dig i butikken.`,
        regards: isEn ? `Best regards,` : `Venlig hilsen,`,
        team: isEn ? `The UBreak WeFix Team` : `UBreak WeFix Teamet`,
        rights: isEn ? `&copy; ${new Date().getFullYear()} UBreak WeFix - All rights reserved.` : `&copy; ${new Date().getFullYear()} UBreak WeFix - Alle rettigheder forbeholdes.`
    };

    const adminSubject = `Ny Booking #${booking.id}: ${booking.device_model}`;

    // Google Calendar Link
    // Format: YYYYMMDDTHHMMSSZ - Basic parsing assuming "YYYY-MM-DD HH:MM" or similar
    // For robustness, let's just strip non-digits.
    const rawDigits = booking.booking_date ? booking.booking_date.replace(/[^0-9]/g, '') : '';
    // If we have at least 8 digits (YYYYMMDD), use it.
    const datePart = rawDigits.substring(0, 8);
    const timePart = rawDigits.length >= 12 ? rawDigits.substring(8, 12) + '00' : '090000';

    const startTime = datePart + 'T' + timePart;
    // End time + 1 hour approx
    let endHour = parseInt(timePart.substring(0, 2)) + 1;
    const endTime = datePart + 'T' + endHour.toString().padStart(2, '0') + timePart.substring(2);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(isEn ? "Repair at UBreak WeFix" : "Reparation hos UBreak WeFix")}` +
        `&details=${encodeURIComponent(`${texts.deviceLabel} ${booking.device_model}\n${texts.problemLabel} ${booking.problem}`)}` +
        `&location=${encodeURIComponent("Skibhusvej 109, 5000 Odense C")}` +
        `&dates=${startTime}/${endTime}`;

    // ICS File Content
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//UBreak WeFix//Booking//' + (isEn ? 'EN' : 'DA'),
        'BEGIN:VEVENT',
        `UID:${booking.id}@ubreakwefix.dk`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        `SUMMARY:${isEn ? "Repair at UBreak WeFix" : "Reparation hos UBreak WeFix"}`,
        `DESCRIPTION:${texts.deviceLabel} ${booking.device_model}\\n${texts.problemLabel} ${booking.problem}`,
        `LOCATION:Skibhusvej 109, 5000 Odense C`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const htmlUser = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                 <img src="cid:logo" alt="UBreak WeFix" style="height: 40px; display: block; margin: 0 auto;">
            </div>
            
            <div style="padding: 30px 20px; background-color: #fff; border: 1px solid #e2e8f0; border-top: none;">
                <h2 style="color: #0f172a; margin-top: 0;">${texts.title}</h2>
                <p>${texts.received}</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #0f172a;">${texts.detailsHeader}</h3>
                    <p style="margin: 5px 0;"><strong>${texts.deviceLabel}</strong> ${booking.device_model}</p>
                    <p style="margin: 5px 0;"><strong>${texts.problemLabel}</strong> ${booking.problem}</p>
                    <p style="margin: 5px 0;"><strong>${texts.dateLabel}</strong> ${booking.booking_date}</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${googleCalendarUrl}" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">${texts.googleBtn}</a>
                    <p style="font-size: 13px; color: #64748b; margin-top: 10px;">${texts.iosHint}</p>
                </div>
                
                <p>${texts.closing}</p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-weight: bold;">${texts.regards}</p>
                    <p style="margin: 5px 0 0; color: #0f172a;">${texts.team}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;">
                        Skibhusvej 109, 5000 Odense C<br>
                        Tlf: +45 12 34 56 78
                    </p>
                </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
                <p>${texts.rights}</p>
            </div>
        </div>
    `;

    const htmlAdmin = `
        <h1>Ny Booking #${booking.id}</h1>
        <p>En ny kunde har booket en tid.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>Navn:</strong> ${booking.customer_name}</p>
            <p><strong>Email:</strong> ${booking.customer_email}</p>
            <p><strong>Tlf:</strong> ${booking.customer_phone}</p>
            <p><strong>Enhed:</strong> ${booking.device_model}</p>
            <p><strong>Problem:</strong> ${booking.problem}</p>
            <p><strong>Dato:</strong> ${booking.booking_date}</p>
            <p><strong>Sprog:</strong> ${language}</p>
        </div>
    `;

    // 1. Send to User with Attachment AND Logo
    const userPromise = sendEmail(
        booking.customer_email,
        texts.subject,
        htmlUser,
        [
            logoAttachment,
            {
                filename: 'booking.ics',
                content: icsContent,
                contentType: 'text/calendar'
            }
        ]
    ).catch(err => console.error("User Booking Email Failed:", err));

    // 2. Send to Admin
    const adminPromise = sendEmail('Support@ubreakwefix.dk', adminSubject, htmlAdmin);

    return Promise.all([userPromise, adminPromise]);
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

const sendUserAutoReply = async (name, email, subject, language = 'da') => {
    const isEn = language === 'en';

    const texts = {
        subject: isEn ? `We received your message: ${subject}` : `Vi har modtaget din besked: ${subject}`,
        title: isEn ? `Thank you for contacting us, ${name}` : `Tak for din henvendelse, ${name}`,
        received: isEn ? `We confirm that we have received your message regarding "<strong>${subject}</strong>".` : `Vi bekræfter hermed at vi har modtaget din besked vedrørende "<strong>${subject}</strong>".`,
        response: isEn ? `Our team is reviewing your inquiry and will get back to you as soon as possible - usually within 24 hours.` : `Vores team er allerede i gang med at gennemgå din henvendelse, og vi vender tilbage til dig hurtigst muligt - typisk inden for 24 timer.`,
        urgent: isEn ? `Need urgent help? You are always welcome to call us or visit the shop.` : `Har du brug for akut hjælp? Du er altid velkommen til at ringe til os eller besøge butikken.`,
        regards: isEn ? `Best regards,` : `Venlig hilsen,`,
        team: `UBreak WeFix Teamet`, // Same for both or "The UBreak WeFix Team"
        footer: `Skibhusvej 109, 5000 Odense C<br>Tlf: +45 12 34 56 78`,
        rights: isEn ? `&copy; ${new Date().getFullYear()} UBreak WeFix - All rights reserved.` : `&copy; ${new Date().getFullYear()} UBreak WeFix - Alle rettigheder forbeholdes.`
    };

    // Override team name for English if desired
    if (isEn) texts.team = "The UBreak WeFix Team";

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                 <img src="cid:logo" alt="UBreak WeFix" style="height: 40px; display: block; margin: 0 auto;">
            </div>
            
            <div style="padding: 30px 20px; background-color: #fff; border: 1px solid #e2e8f0; border-top: none;">
                <h2 style="color: #0f172a; margin-top: 0;">${texts.title}</h2>
                
                <p>${texts.received}</p>
                
                <p>${texts.response}</p>
                
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 25px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;">${texts.urgent}</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-weight: bold;">${texts.regards}</p>
                    <p style="margin: 5px 0 0; color: #0f172a;">${texts.team}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;">
                        ${texts.footer}
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
                <p>${texts.rights}</p>
            </div>
        </div>
    `;
    return sendEmail(email, texts.subject, html, [logoAttachment]);
};

const sendContactMessage = async (name, email, subject, message, language = 'da') => {
    const emailSubject = `Kontaktformular: ${subject}`;
    const html = `
        <h1>Ny besked fra ${name}</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Emne:</strong> ${subject}</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Besked:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
        </div>

        <p><small>Sendt fra ubreakwefix.dk (Sprog: ${language})</small></p>
    `;

    // Check for development mode handling if needed, otherwise send both
    // Parallel sending to user and support
    const [adminResult, userResult] = await Promise.all([
        sendEmail('Support@ubreakwefix.dk', emailSubject, html),
        sendUserAutoReply(name, email, subject, language)
    ]);

    return adminResult; // Return admin result as primary status
};

module.exports = {
    sendBookingConfirmation,
    sendStatusUpdate,
    sendNewApplicationNotification,
    sendBusinessApprovalEmail,
    sendBusinessRejectionEmail,
    sendContactMessage
};
