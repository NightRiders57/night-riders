// netlify/functions/delete.js

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { fileName, folder } = body;

    if (!fileName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Nome file mancante." }) };
    }

    const GITHUB_TOKEN = process.env.MY_GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.MY_GITHUB_USER;
    const REPO_NAME = process.env.MY_REPO_NAME;

    const targetPath = `${folder}/${fileName}`;
    const githubUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${targetPath}`;

    // Per eliminare un file su GitHub, serve prima ottenere il suo "sha"
    const getFileResponse = await fetch(githubUrl, {
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "Netlify-Serverless-App"
      }
    });

    if (!getFileResponse.ok) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "File non trovato su GitHub." }) };
    }

    const fileData = await getFileResponse.json();
    const fileSha = fileData.sha;

    // Ora inviamo la richiesta di cancellazione con lo SHA ottenuto
    const deleteResponse = await fetch(githubUrl, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "User-Agent": "Netlify-Serverless-App"
      },
      body: JSON.stringify({
        message: `Eliminato file: ${fileName} da interfaccia web`,
        sha: fileSha,
        branch: "main"
      })
    });

    if (deleteResponse.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "File eliminato con successo!" })
      };
    } else {
      const errorData = await deleteResponse.json();
      return { statusCode: deleteResponse.status, headers, body: JSON.stringify({ error: errorData.message }) };
    }

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};