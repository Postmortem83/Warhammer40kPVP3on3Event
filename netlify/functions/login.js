// netlify/functions/login.js
// Server-side admin login (Netlify Function)
// Verwende ENV-Variablen auf Netlify: ADMIN_USER, ADMIN_PASS, JWT_SECRET

const jwt = require("jsonwebtoken");

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "ForTheEmperor83!";
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_TO_A_STRONG_SECRET";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { username, password } = body;

    if (!username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing credentials" }) };
    }

    // Prüfen: wenn Username+Pass korrekt -> Token erzeugen
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Token mit kurzer Laufzeit (z.B. 2 Stunden)
      const token = jwt.sign({ user: username, role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
      return {
        statusCode: 200,
        body: JSON.stringify({ token })
      };
    }

    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error", details: err.message }) };
  }
};
