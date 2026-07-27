// netlify/functions/upload.js

exports.handler = async (event, context) => {
  // Intestazioni CORS per permettere le chiamate da qualsiasi dominio
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // 1. Gestione della richiesta Preflight (OPTIONS) inviata dal browser
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // 2. Blocca metodi diversi da POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed"
    };
  }

  try {
    // 3. Decodifica i dati inviati dal sito
    const body = JSON.parse(event.body);
    const { fileName, fileBase64, folder } = body;

    if (!fileName || !fileBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Dati mancanti." })
      };
    }

    // 4. Recupera le credenziali dalle Variabili d'Ambiente
    const GITHUB_TOKEN = process.env.MY_GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.MY_GITHUB_USER;
    const REPO_NAME = process.env.MY_REPO_NAME;

    const targetPath = `${folder}/${fileName}`;
    const githubUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${targetPath}`;

    const payload = {
      message: `Upload da sito: ${fileName}`,
      content: fileBase64,
      branch: "main"
    };

    // 5. Invia la richiesta alle API di GitHub
    const response = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Netlify-Serverless-App"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "File caricato con successo!", details: result })
      };
    } else {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: result.message })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};