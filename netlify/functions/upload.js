// netlify/functions/upload.js

exports.handler = async (event, context) => {
  // Gestisce solo le richieste di tipo POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1. Decodifica i dati inviati dal sito
    const body = JSON.parse(event.body);
    const { fileName, fileBase64, folder } = body;

    if (!fileName || !fileBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "Dati mancanti." }) };
    }

    // 2. Recupera le credenziali dalle Variabili d'Ambiente sicure
    const GITHUB_TOKEN = process.env.MY_GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.MY_GITHUB_USER;
    const REPO_NAME = process.env.MY_REPO_NAME;

    // Costruisce il percorso di destinazione (es. docs/Pistoni2026/miofile.pdf)
    const targetPath = `${folder}/${fileName}`;

    // 3. Prepara la chiamata alle API REST di GitHub
    const githubUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${targetPath}`;
    
    const payload = {
      message: `Upload da sito: ${fileName}`,
      content: fileBase64, // Stringa Base64 pulita inviata dal frontend
      branch: "main"
    };

    // 4. Invia la richiesta a GitHub dal server Netlify
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
        body: JSON.stringify({ message: "File caricato con successo!", details: result })
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result.message })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};