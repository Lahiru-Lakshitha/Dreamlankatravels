"use server";

import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail } from "@/lib/email";

// --- Schemas ---

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email").max(255),
    subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

const quoteSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email").max(255),
    phone: z.string().min(5, "Please enter a valid phone number").max(20),
    country: z.string().min(1, "Please select your country"),
    startDate: z.string().min(1, "Please select a start date"),
    endDate: z.string().min(1, "Please select an end date"),
    travelers: z.string().min(1, "Please specify number of travelers"), // Stored as string in form, parsed to int
    budget: z.string().min(1, "Please select a budget range"),
    tourType: z.string().min(1, "Please select a tour type"),
    specialRequests: z.string().max(1000).optional(),
    destinations: z.array(z.string()).optional(),
});

const tripPlanSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budgetMin: z.number(),
    budgetMax: z.number(),
    duration: z.string().optional(),
    interests: z.array(z.string()),
});

// --- Actions ---

export async function submitContactForm(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    };

    const validatedFields = contactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;


    // 1. Save to Supabase (Optional but recommended)
    const { error: dbError } = await (supabase as any)
        .from("contact_messages")
        .insert([
            {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: "new",
            },
        ]);

    if (dbError) {
        console.error("Database Error (Contact):", dbError);
        // Proceed to send email anyway, or return error? 
        // Usually improved reliability to try both.
    }

    // 2. Send Admin Email
    const emailResult = await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL || "lahirulakshithamax00@gmail.com",
        subject: `New Contact Message: ${data.subject}`,
        html: `
      <h1>New Message from ${data.name}</h1>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">${data.message.replace(/\n/g, "<br>")}</blockquote>
    `,
    });

    if (!emailResult.success) {
        return { error: "Failed to send email. Please try again later." };
    }

    return { success: true, message: "Message sent successfully!" };
}

export async function submitQuoteRequest(formData: FormData): Promise<{ error?: string | Record<string, string[]>; success?: boolean; message?: string }> {
    // Extract destinations manually if it's sent as a separate field or JSON
    const destinationsRaw = formData.get("destinations");
    let destinations: string[] = [];
    if (destinationsRaw) {
        try {
            destinations = JSON.parse(destinationsRaw as string);
        } catch (e) {
            // ignore
        }
    }

    const rawData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        travelers: formData.get("travelers"),
        budget: formData.get("budget"),
        tourType: formData.get("tourType"),
        specialRequests: formData.get("specialRequests"),
        destinations: destinations,
    };

    const validatedFields = quoteSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;
    const firstName = data.fullName.split(' ')[0];

    // 1. Send Customer Confirmation Email (Required Priority)
    const customerEmailResult = await sendEmail({
        to: data.email,
        subject: "Your Sri Lanka Journey Request Has Been Received 🌿",
        html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
        <p>Hi ${firstName},</p>
        
        <p>Thank you for reaching out to Dream Lanka Travels.</p>
        
        <p>We’ve received your request for a personalized Sri Lanka experience.<br>
        One of our travel designers is now reviewing your preferences and will contact you shortly with a bespoke proposal.</p>
        
        <p>If you’d like faster assistance, you can reach us directly on WhatsApp.</p>
        
        <br>
        <p>Warm regards,<br>
        <strong>Dream Lanka Travels</strong><br>
        <span style="color: #666; font-size: 0.9em;">Luxury Travel Designers</span></p>
      </div>
    `,
    });

    // 2. Send Admin Notification (Required Priority)
    const adminEmailResult = await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL || "lahirulakshithamax00@gmail.com",
        replyTo: data.email, // Allow admin to reply directly to customer
        subject: `New Lead: ${data.fullName} - ${data.tourType}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
        <h2 style="color: #0F3D2E;">New Quote Request</h2>
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        
        <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Traveler Details</h3>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        
        <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Trip Details</h3>
        <p><strong>Dates:</strong> ${data.startDate} to ${data.endDate}</p>
        <p><strong>Travelers:</strong> ${data.travelers}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Type:</strong> ${data.tourType}</p>
        <p><strong>Destinations:</strong> ${data.destinations?.join(", ") || "None specified"}</p>
        
        <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">Special Requests</h3>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${data.specialRequests || "None provided"}</p>
      </div>
    `,
    });

    // 3. Check for Email Failures
    if (!customerEmailResult.success || !adminEmailResult.success) {
        console.error("Email Sending Failed:", { customer: customerEmailResult, admin: adminEmailResult });
        return { error: "Failed to submit quote request. Please try again." };
    }

    // 4. Save to Supabase (Non-blocking)
    try {
        const { error: dbError } = await supabase
            .from("quotes")
            .insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    country: data.country,
                    travel_start_date: data.startDate,
                    travel_end_date: data.endDate,
                    travelers: parseInt(data.travelers) || 1,
                    budget_range: data.budget,
                    tour_type: data.tourType,
                    destinations: data.destinations && data.destinations.length > 0 ? data.destinations : null,
                    special_requests: data.specialRequests || null,
                    status: "pending",
                },
            ]);

        if (dbError) {
            console.error("Database Error (Quote Insert):", dbError);
        }
    } catch (e) {
        console.error("Supabase operation exception:", e);
    }

    return { success: true, message: "Quote request submitted successfully!" };
}

export async function submitTripPlan(formData: FormData) {
    const interestsRaw = formData.get("interests");
    const interests = interestsRaw ? JSON.parse(interestsRaw as string) : [];

    const rawData = {
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        budgetMin: Number(formData.get("budgetMin")),
        budgetMax: Number(formData.get("budgetMax")),
        duration: formData.get("duration") as string,
        interests: interests,
    };

    const validatedFields = tripPlanSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: "Invalid trip plan data" };
    }

    const data = validatedFields.data;


    // 1. Save to Supabase (assuming a 'trip_plans' or 'leads' table)
    // Since we don't have user email here typically unless they are logged in or prompt for it.
    // The current UI relies on the user just searching. 
    // However, the prompt asks to "store trip requests". Storing anonymous requests is less useful without contact info.
    // We will assume this action is called *if* we add a "Save" button or we just log parameters for analytics.
    // But strictly, let's just log it to a table if it exists, or skip if no contact info.
    // Actually, let's assume this is for a "Lead" capture.

    // For now, I'll log it to `trip_requests` if table exists.
    const { error: dbError } = await (supabase as any).from('trip_plans').insert([{
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        duration: data.duration || null,
        interests: data.interests,
        created_at: new Date().toISOString()
    }]);

    if (dbError) {
        console.warn("Could not save trip plan (maybe table missing):", dbError);
    }

    // No email to send if we don't have user email.
    // If we had user email, we would send it.

    return { success: true };
}
