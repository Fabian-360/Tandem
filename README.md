# Tandem – eure Paar-App

Tandem ist eine Web-App. Sie läuft im Browser und lässt sich wie eine echte App auf den Home-Bildschirm legen. Ein App Store ist dafür nicht nötig.

Es gibt zwei Betriebsarten:

- **Demo-Modus** (sofort nutzbar): Die Daten bleiben nur auf dem jeweiligen Gerät. Oben rechts wechselst du zwischen der Ansicht von Fabian und der von Lena. Das ist ideal zum Ausprobieren.
- **Echter Modus mit Firebase**: Ihr meldet euch an und alles wird zwischen euren Handys synchronisiert. Tagebuch, Notizen, Wunschliste und private Ausgaben bleiben dabei nur für die jeweilige Person sichtbar.

---

## Teil 1 – Demo-Modus online stellen (ca. 10 Minuten)

1. Entpacke die ZIP-Datei `tandem-app.zip`.
2. Gehe auf github.com und melde dich an (Konto „Fabian-360“).
3. Klicke oben rechts auf **+** und dann auf **New repository**.
   - Name: `Tandem`
   - Sichtbarkeit: **Public** (für kostenlose GitHub Pages nötig) *
   - Klicke auf **Create repository**.
4. Klicke auf der neuen Seite auf **uploading an existing file**.
5. Lade **alle Dateien** aus dem entpackten Ordner hoch (es gibt keine Unterordner mehr – auf dem iPad einfach in der Dateien-App alle auswählen).
   Klicke danach auf **Commit changes**.
6. Gehe zu **Settings → Pages**.
   - Wähle unter „Branch“ den Eintrag **main** und **/ (root)** und klicke auf **Save**.
7. Nach 1–2 Minuten ist die App unter dieser Adresse erreichbar:
   **https://fabian-360.github.io/Tandem/**
8. Öffne die Adresse auf dem iPhone in **Safari**. Tippe auf **Teilen** und dann auf **Zum Home-Bildschirm**.

\* Hinweis: Bei einem öffentlichen Repository kann jeder, der den Link kennt, den Code und die Bilder sehen. Eure **Daten** sind davon nicht betroffen. Im Demo-Modus liegen sie nur auf dem Gerät, mit Firebase sind sie durch Login und Regeln geschützt.

**Festtage vorab ansehen:** Öffne Start → Erinnerungen → „Zum Testen“ und gib dort ein Datum ein, zum Beispiel den 6.12., den 24.12. oder Lenas Geburtstag. Mit „Zurück zu heute“ kehrst du zum echten Datum zurück.

---

## Teil 2 – Firebase einrichten (echter Modus, ca. 20 Minuten)

1. Gehe auf **console.firebase.google.com**, klicke auf **Projekt hinzufügen** und nenne es `tandem`. Google Analytics brauchst du nicht.
2. **Authentication** → **Jetzt starten** → Anbieter **E-Mail/Passwort** aktivieren.
   - Lege dann unter **Users → Nutzer hinzufügen** zwei Konten an: eines für dich und eines für Lena.
   - Notiere dir die beiden **Nutzer-UIDs**. Sie stehen in der Liste.
3. **Firestore Database** → **Datenbank erstellen** → Standort `europe-west3 (Frankfurt)` → **Produktionsmodus**.
4. Lege in Firestore von Hand ein Dokument an:
   - Sammlung `households`, Dokument-ID `tandem`
   - Feld `members` vom Typ **array** mit den beiden UIDs als Einträgen (Typ string)
5. Öffne in Firestore den Reiter **Regeln**. Ersetze dort alles durch den Inhalt der Datei `firestore.rules` und klicke auf **Veröffentlichen**.
6. Klicke auf **Projekteinstellungen** (Zahnrad) → **Meine Apps** → das Web-Symbol `</>`. Gib als Name `Tandem` ein. Firebase zeigt dir danach ein `firebaseConfig`-Objekt an.
7. Öffne im GitHub-Repository die Datei `js/firebase-config.js` und klicke auf den Stift zum Bearbeiten. Ersetze die Werte `DEIN_…` durch deine Werte aus Schritt 6 und klicke auf **Commit changes**.
8. Gehe in Firebase zu **Authentication → Einstellungen → Autorisierte Domains** und füge `fabian-360.github.io` hinzu.
9. Öffne die App neu. Beim ersten Start meldet ihr euch an und wählt einmal „Ich bin Fabian“ oder „Ich bin Lena“.

Die Daten aus dem Demo-Modus werden **nicht** übernommen. Das ist so gewollt, denn der Demo-Modus dient nur zum Ausprobieren.

---

## Gut zu wissen

- **Updates:** Wenn du Dateien änderst, erhöhe in `sw.js` die Versionsnummer, zum Beispiel von `tandem-v1` auf `tandem-v2`. Sonst zeigt das iPhone noch die alte Version. Hilft das nicht, schließe die App einmal ganz und öffne sie neu.
- **Offline:** Die App funktioniert auch ohne Netz. Änderungen werden synchronisiert, sobald wieder Internet da ist.
- **Bilder:** Die Bilder sind nur für euch beide zur privaten Nutzung gedacht.
- **Kosten:** Für zwei Personen reicht der kostenlose Firebase-Tarif („Spark“) locker.
