import { createMailgunClient } from "../../config/mailgun.js";

const { mg, domain } = createMailgunClient(
  process.env.MAILGUN_API_KEY,
  process.env.MAILGUN_DOMAIN
);

async function sendEmail(to, subject, html) {
  console.log("Sending email to: ", to);
  try {
    const data = await mg.messages.create(domain, {
      from: `<donotreply> <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      text: "",
      html,
    });
    console.log("Email sent to", to);
    return data;
  } catch (error) {
    console.error("Mailgun error:", error);
    throw error;
  }
}

export { sendEmail };