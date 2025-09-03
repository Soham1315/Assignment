import path from "path";
import fs from "fs";
import formidable from "formidable";
import { ensureSchema, getPool } from "../../../lib/db";

export const config = { api: { bodyParser: false } };

function parseForm(req, uploadDir) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
      filename: (name, ext, part, form) => {
        const base = String(part.originalFilename || "file").replace(/\s+/g, "_");
        const ts = Date.now();
        return ts + "-" + base;
      }
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), "public", "schoolImages");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  if (req.method === "POST") {
    try {
      await ensureSchema();
      const { fields, files } = await parseForm(req, uploadDir);
      const getField = (v) => Array.isArray(v) ? String(v[0] || "").trim() : String(v || "").trim();
      const name = getField(fields.name);
      const address = getField(fields.address);
      const city = getField(fields.city);
      const state = getField(fields.state);
      const contact = getField(fields.contact);
      const email_id = getField(fields.email_id);
      const f = files.image;
      const fileObj = Array.isArray(f) ? f[0] : f;
      if (!name || !address || !city || !state || !contact || !email_id || !fileObj) {
        res.status(400).json({ ok: false, error: "Missing fields" });
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id);
      const contactOk = /^[0-9\-\+\s]{7,15}$/.test(contact);
      if (!emailOk) {
        res.status(400).json({ ok: false, error: "Invalid email" });
        return;
      }
      if (!contactOk) {
        res.status(400).json({ ok: false, error: "Invalid contact" });
        return;
      }
      const relPath = "/schoolImages/" + path.basename(fileObj.filepath || fileObj.filepath);
      const pool = getPool();
      await pool.execute(
        "INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, address, city, state, contact, relPath, email_id]
      );
      res.status(201).json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, error: "Server error" });
    }
  } else if (req.method === "GET") {
    try {
      await ensureSchema();
      const pool = getPool();
      const [rows] = await pool.query("SELECT id, name, address, city, image FROM schools ORDER BY id DESC");
      res.status(200).json({ ok: true, data: rows });
    } catch (e) {
      res.status(500).json({ ok: false, error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end("Method Not Allowed");
  }
}