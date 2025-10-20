Night Riders - sito base (Jekyll) + Netlify CMS
-----------------------------------------------
Istruzioni rapide per pubblicare:

1) Crea un nuovo repository su GitHub (es. night-riders) e spingi tutto questo contenuto su branch 'main'.
2) Apri Netlify e crea un nuovo site -> "Add new site" -> "Import from Git" -> collega GitHub.
   - Seleziona il repository e branch 'main'. Netlify farà una build con Jekyll.
3) Abilita Netlify Identity e Git Gateway:
   - Nel pannello Site settings -> Identity -> Enable Identity.
   - In Identity settings -> Services -> Enable Git Gateway.
4) In GitHub: vai nel file admin/config.yml e sostituisci YOUR_GITHUB_USERNAME/YOUR_REPO_NAME con il path del repo.
5) Vai a https://your-netlify-site.netlify.app/admin/ per accedere al pannello di Netlify CMS.
   - Crea un account via Netlify Identity, poi potrai creare news e album.
6) Sostituisci le immagini placeholder in /img/ con le tue foto, o caricale via CMS (img/uploads).

Note tecniche:
- Il sito è basato su Jekyll; Netlify eseguirà la build automaticamente.
- Le news si trovano in _posts (formato markdown).
- Gli album sono in _albums (collection personalizzata) e vengono resi con output: true.
