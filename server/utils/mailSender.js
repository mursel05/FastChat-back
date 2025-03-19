const nodemailer = require("nodemailer");

const companyEmail = process.env.COMPANY_EMAIL;
const companyEmailPassword = process.env.COMPANY_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: companyEmail,
    pass: companyEmailPassword,
  },
});

exports.sendMail = async (data) => {
  try {
    await transporter.sendMail({
      from: `"FastChat" <${companyEmail}>`,
      ...data,
    });
    return true;
  } catch (error) {
    return false;
  }
};
