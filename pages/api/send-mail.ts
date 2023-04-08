// import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");
import type { NextApiRequest, NextApiResponse } from "next";

type resData = {
  status: string;
};
type submissionProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  profileBase64: string;
  photoIdBase64: string;
  pdfBase64: string;
};
type reqBody = {
  host: string;
  email: string;
  password: string;
  designatedEmail: string;
  pdfUri: string;
  clientInfo: submissionProps;
  [rest: string]: any;
};

const API_TOKEN = process.env.API_TOKEN;
export default async function handler(req: NextApiRequest, res: NextApiResponse<resData>) {
  console.log(req.headers);
  if (req.headers.authorization !== `bearer ${API_TOKEN}`) {
    res.status(401).json({ status: "UNAUTHORIZED" });
    return;
  }
  const { host, email, password, designatedEmail, clientInfo }: reqBody = req.body;
  // console.log("pdf", clientInfo.pdfBase64);
  // console.log("image1", clientInfo.profileBase64);
  // console.log("psavasvasvdf", clientInfo.photoIdBase64);
  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
  });
  const html = `
  <div>
    <p style="font-size:1.1rem">
    First Name: <b>${clientInfo.firstName}</b>
    </p>
  <hr>
    <p style="font-size:1.1rem">
    Last Name: <b>${clientInfo.lastName}</b>
    </p>
  <hr>
    <p style="font-size:1.1rem">
    Email: <b>${clientInfo.email}</b>
    </p>
  <hr>
    <p style="font-size:1.1rem">
    Phone Number: <b>${clientInfo.phoneNumber}</b>
    </p>
  <hr>
    <p style="font-size:1.1rem">
    Date of Birth: <b>${clientInfo.dateOfBirth}</b>
    </p>
  </div>
  `;
  const message = {
    from: `"Iron Wolf App" <${email}>`,
    to: designatedEmail,
    subject: `Waiver From Submission - ${clientInfo.firstName} ${clientInfo.lastName}`,
    text: `
    First Name: ${clientInfo.firstName}
    Last Name: ${clientInfo.lastName}
    Email: ${clientInfo.email}
    Phone Number: ${clientInfo.phoneNumber}
    Date of Birth: ${clientInfo.dateOfBirth}
    `,
    html,
    attachments: [
      {
        filename: `${clientInfo.firstName}_${clientInfo.lastName}-profile.jpg`,
        content: clientInfo.profileBase64 || "",
        contentType: "image/jpeg",
        encoding: "base64",
      },
      {
        filename: `${clientInfo.firstName}_${clientInfo.lastName}-photoId.jpg`,
        content: clientInfo.photoIdBase64 || "",
        contentType: "image/jpeg",
        encoding: "base64",
      },
      {
        filename: `WaiverForm-${clientInfo.firstName}_${clientInfo.lastName}.pdf`,
        content: clientInfo.pdfBase64 || "",
        contentType: "application/pdf",
        encoding: "base64",
      },
    ],
  };
  try {
    await transporter.sendMail(message);
    res.status(200).json({ status: "successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed" });
  }
}