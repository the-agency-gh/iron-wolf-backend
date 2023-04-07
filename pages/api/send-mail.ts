// import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

type resData = {
  status: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<resData>) {
  if (req.headers.token !== process.env.API_TOKEN) {
    res.status(401).json({ status: "UNAUTHORIZED" });
  }
  res.status(200).json({ status: "successful" });
}
