import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["https://athaarrvv.vercel.app"], // tera portfolio ka domain
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact-message", async (req, res) => {
  const { fullname, email, message } = req.body;

  if (!fullname || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields required" });
  }

  try {
    // Email to YOU
    await resend.emails.send({
      from: "Portfolio Contact <no-reply@resend.dev>",
      to: "athaarrvv1@gmail.com", // apna email yaha
      subject: `New message from ${fullname}`,
      html: `
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Confirmation email to visitor
    await resend.emails.send({
      from: "Atharv Jain <no-reply@resend.dev>",
      to: email,
      subject: "We received your message!",
      html: `
        <p>Hi ${fullname},</p>
        <p>Thanks for reaching out! I have received your message and will get back to you soon.</p>
        <p><em>Your message:</em></p>
        <blockquote>${message}</blockquote>
        <p>- Atharv Jain</p>
      `
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
