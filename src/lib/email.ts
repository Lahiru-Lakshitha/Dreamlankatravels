import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    from?: string; // Optional, defaults to env var or fallback
    replyTo?: string; // Optional reply-to address
}

export async function sendEmail({ to, subject, html, from, replyTo }: SendEmailParams) {
    try {
        const fromEmail = from || process.env.EMAIL_FROM || 'Dream Lanka Travels <noreply@dreamlankatravels.com>';

        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY is missing. Email simulation:', { to, subject });
            return { success: true, id: 'simulated' };
        }

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            html,
            replyTo: replyTo,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Email Sending Failed:', error);
        return { success: false, error };
    }
}
