import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "LBC Website <onboarding@resend.dev>",
      to: "info@lbcon.gr",
      replyTo: email,
      subject: `Νέο μήνυμα από ${name}`,
      html: `
        <h2>Νέο μήνυμα από τη φόρμα επικοινωνίας</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr>
            <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Όνομα</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td>
          </tr>
          ${phone ? `<tr>
            <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Τηλέφωνο</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${phone}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Μήνυμα</td>
            <td style="padding:8px 12px;white-space:pre-wrap;">${message}</td>
          </tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
