// Netlify Function: register-team.js
// Leitet Anfragen an dein Google Apps Script weiter und löst CORS-Probleme

const SHEET_URL = 'https://script.google.com/macros/s/AKfycby9ZRUGrkLhLptrn7xTVfLVYrDMP-JVt7v0sY3lqulD_CoOZed4BCJ0LlmRgo18n2mw/exec';

export async function handler(event, context) {
  // Standard CORS Header
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  };

  // Preflight-Anfrage von Browsern
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // POST: Formulardaten an Google Sheet senden
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);

      const res = await fetch(SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } 
    
    // GET: Registrierte Teams aus Google Sheet abrufen
    else if (event.httpMethod === 'GET') {
      const res = await fetch(SHEET_URL);
      const data = await res.json();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } 
    
    // Andere HTTP Methoden
    else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ status: 'error', message: 'Method not allowed' })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
}
