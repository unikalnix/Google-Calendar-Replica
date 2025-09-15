import FormData from "form-data";
import Mailgun from "mailgun.js";

function createMailgunClient(apiKey, domain) {
  const mailgun = new Mailgun(FormData);

  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || apiKey,
    url: "https://api.mailgun.net",
  });

  return { mg, domain };
}

export {createMailgunClient}