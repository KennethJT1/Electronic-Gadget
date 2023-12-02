import nodemailer from "nodemailer";

export const sendEmail = async (data: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 2525,
    // secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};
