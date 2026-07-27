<?php
session_start();

// 1. IMPOSTA QUI LA TUA PASSWORD
$password_corretta = "NightRiders2026!"; // Sostituisci con la password che desideri

$errore = false;

// Gestione Login
if (isset($_POST['password'])) {
    if ($_POST['password'] === $password_corretta) {
        $_SESSION['autenticato'] = true;
    } else {
        $errore = true;
    }
}

// Gestione Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: area-riservata.php");
    exit;
}

$is_logged_in = isset($_SESSION['autenticato']) && $_SESSION['autenticato'] === true;
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Area Riservata - Night Riders</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    .protected-section { max-width: 800px; margin: 40px auto; padding: 20px; text-align: center; }
    .login-box, .upload-box { background: rgba(0, 0, 0, 0.6); padding: 30px; border-radius: 8px; margin-top: 20px; }
    .login-box input[type="password"] { padding: 10px; font-size: 16px; border-radius: 4px; border: 1px solid #ccc; margin-right: 10px; }
    .btn-orange { padding: 10px 20px; font-size: 16px; background-color: #f49529; color: #fff; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .file-item { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); padding: 15px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid #f49529; }
    .download-btn { color: #f49529; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="bg-fixed"></div>
  <header>
    <div class="hero"><img src="img/hero.jpg" alt="Night Riders Hero"></div>
    <nav>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="news/news1.html">News</a></li>
        <li><a href="gallery/gallery.html">Gallery</a></li>
        <li><a href="shop/shop.html">Shop</a></li>
        <li><a href="contatti.html">Contatti</a></li>
        <li><a href="storia.html">La nostra Storia</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="protected-section">
      <h2>Area Riservata</h2>

      <?php if (!$is_logged_in): ?>
        <!-- FORM DI LOGIN (Visibile SOLO se NON autenticato) -->
        <div class="login-box">
          <p>Inserisci la password per accedere ai documenti riservati:</p>
          <form method="POST" action="area-riservata.php">
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" class="btn-orange">Accedi</button>
          </form>
          <?php if ($errore): ?>
            <p style="color: #ff4d4d; margin-top: 10px;">Password errata. Riprova.</p>
          <?php endif; ?>
        </div>

      <?php else: ?>
        <!-- CONTENUTO PROTETTO (Generato dal server SOLO dopo il login) -->
        <div style="text-align: right; margin-bottom: 15px;">
          <a href="area-riservata.php?action=logout" style="color: #ff4d4d;">Esci (Logout)</a>
        </div>

        <div class="file-list">
          <h3>Iscrizioni Eventi</h3>
          <div class="file-item">
            <span>📄 Iscrizioni NovemberMeet2025 (PDF)</span>
            <a href="docs/Iscrizioni NovemberMeet2025.pdf" class="download-btn" download>Scarica PDF</a>
          </div>
          <div class="file-item">
            <span>📄 Iscrizioni Route 57km 3 (PDF)</span>
            <a href="docs/Iscrizioni Route57km3.pdf" class="download-btn" download>Scarica PDF</a>
          </div>
          <div class="file-item">
            <span>📄 Iscrizioni PitLane57 Novembre 2026 (XLSX)</span>
            <a href="docs/Iscrizioni PitLane57 Novembre 2026.xlsx" class="download-btn" download>Scarica XLSX</a>
          </div>

          <h3>Permessi Eventi</h3>
          <div class="file-item">
            <span>📄 Permesso Polizia Statico AF Settembre 2026 (PDF)</span>
            <a href="docs/Permesso polizia locale raduno 19 settembre 2026 AF Petroli.pdf" class="download-btn" download>Scarica PDF</a>
          </div>
        </div>
      <?php endif; ?>
    </section>
  </main>
</body>
</html>