import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  }
});

const sendMail = async (formData) => {
  const mailOptions = {
    from: {
      name: 'SRKR Coding Club',
      address: process.env.USER
    },
    to: [formData.email], // send to the registered affiliate
    subject: "🎉 Registration Successful — SRKR Coding Club",
    html: `
<div style="max-width:680px; margin:0 auto;">
  <div style="background:#ffffff; border-radius:12px; box-shadow:0 6px 18px rgba(15,23,42,0.08); padding:28px;">
    <h1 style="font-size:20px; margin:0;">Registration Successful — Welcome to SRKR Coding Club!</h1>
    <p style="color:#6b7280;">We're thrilled to have you as part of SRKR Coding Club.</p>

    <p>Hey  <strong>${formData.fullName}</strong>,</p>
    <p>🎉 <strong>Congratulations!</strong> Your registration for the SRKR Coding Club is complete! Get ready to Learn, Build, and Innovate with a passionate community.</p>

    <p>Your Club ID is:</p>
    <div style="background:#f8fafc; border-radius:8px; padding:14px; margin:18px 0;">
      <div style="text-align:center; font-size:20px; font-weight:600">${formData.clubId}</div>
    </div>
    <p>Below are your details:</p>
    <div style="background:#f8fafc; border-radius:8px; padding:14px; margin:18px 0;">
      <div><strong>Name:</strong> ${formData.fullName}</div>
      <div><strong>Branch:</strong> ${formData.branch}</div>
      <div><strong>Phone:</strong> ${formData.phoneNumber}</div>
      <div><strong>Club ID:</strong> <b>${formData.clubId}</b></div>
    </div>

    <h2 style="font-size:16px;">What's Next?</h2>
    <ul style="color:#6b7280;">
      <li><strong>Hands-On Learning:</strong> Participate in live courses, workshops, and hands-on projects that focus on the latest technologies and industry-relevant skills.</li>
      <li><strong>Levelup Your Skill:</strong> Sharpen your skills with daily coding challenges and showcase your talent through events, workshops and major competitions like HackOverflow and IconCoders.</li>
      <li><strong>Networking & Growth:</strong> Connect with industry professionals and senior students for mentorship and guidance to accelerate your professional growth.</li>
      <li><strong>Exclusive Access:</strong> Get priority registration and special discounts for all our events, workshops, and hackathons.</li>
      <li><strong>Recognition:</strong> Earn certificates and awards for your participation and achievements in club events.</li>
    </ul>
    <div style="color:#6b7280;">Note: To save your information, please take a snapshot of your details for future reference.</div>

    <p style="font-size:13px; color:#6b7280;">Best regards,<br>SRKR Coding Club</p>
    <hr style="border:none; border-top:1px solid #eef2f7; margin:16px 0"/>
    <p style="font-size:13px; color:#6b7280;">This is an automated message. Please do not reply to this email.</p>
  </div>
</div>
`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${formData.email}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error}`);
  }
};

export default sendMail;
