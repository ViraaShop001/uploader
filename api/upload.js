export const config = {
  api: {
    bodyParser: false,
  },
};

import { Buffer } from "buffer";

const TOKEN = "dm0SIK2U+I0f6Bx8h1b2DaE3IHyCarCN2H2lncDjmwrJTs/zeU30yklisRyV1PfJ"; // isi token kamu
const USERNAME = "ViraaShop001";
const REPO = "uploader";
const BRANCH = "main";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    // ambil raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // cari file dari multipart form
    const text = buffer.toString();
    const start = text.indexOf("\r\n\r\n") + 4;
    const end = text.lastIndexOf("\r\n------");
    const fileBuffer = buffer.slice(start, end);

    // ambil nama file
    const filenameMatch = text.match(/filename="(.+?)"/);
    if (!filenameMatch)
      return res.status(400).json({ error: "Tidak ada file" });

    const originalName = filenameMatch[1];
    const ext = originalName.split(".").pop();

    // nama random
    const randomName =
      Math.random().toString(36).substring(2, 10) + "." + ext;

    // convert base64
    const base64 = fileBuffer.toString("base64");

    // upload ke github
    const response = await fetch(
      `https://api.github.com/repos/${USERNAME}/${REPO}/contents/cdn/${randomName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "upload file",
          content: base64,
          branch: BRANCH,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok)
      return res.status(500).json({ error: data });

    const url = `https://${req.headers.host}/api/file/${randomName}`;

    return res.json({
      success: true,
      url,
    });
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
      }
