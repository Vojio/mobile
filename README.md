# BissTrainer Mobile

Native Expo-Version von BissTrainer fuer iPhone, Android und Expo Web.

Die App ist die mobile Schwester des Web-Prototyps im Root-Repository und uebersetzt dieselbe Lernidee in eine touch-optimierte, native Oberflaeche: Zahnmediziner:innen und Studierende trainieren diagnostische und therapeutische Entscheidungen entlang strukturierter Patientenfaelle.

## Ziel

Die mobile App soll:

- reale oder realitaetsnahe Behandlungsfaelle auf dem Smartphone spielbar machen
- klinische Entscheidungsablaeufe in einzelne Lernschritte zerlegen
- Antworten sofort mit fachlicher Rueckmeldung spiegeln
- Punkte, Fortschritt und Wiederholungen sichtbar machen
- sich schnell auf echten Geraeten testen lassen, ohne nativen Release-Prozess

Expo ist hier vor allem ein pragmischer Prototyping-Stack fuer schnelle Iteration im Hackathon- und Demo-Kontext.

## Aktueller Funktionsumfang

- Fallbibliothek mit 6 exemplarischen Trainingsfaellen
- mehrere Schritte pro Fall mit klinischem Kontext
- Quiz mit Punktevergabe und Begruendung pro Antwort
- laufender Lernfortschritt pro Fall im App-State
- Gesamtpunktestand ueber alle Faelle
- lokale Run-History fuer abgeschlossene Gesamtdurchlaeufe
- helles und dunkles Theme anhand der Systemeinstellung
- Haptics und leichte Vibrationssignale fuer Interaktion
- touch-optimierte, einbildschirmige mobile Oberflaeche

## Tech-Stack

- Expo SDK 54
- React 19
- React Native 0.81
- AsyncStorage fuer lokale Persistenz
- Expo Haptics
- Expo Status Bar
- React Native Safe Area Context

Die Abhaengigkeiten und Scripts sind in `package.json` definiert.

## Projektstruktur

```text
mobile/
├── README.md
├── App.js
├── app.json
├── index.js
├── package.json
├── package-lock.json
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── scripts/
│   └── generate-snack-url.mjs
└── src/
    ├── data/
    │   └── cases.js
    └── lib/
        └── progress.js
```

## Wichtige Dateien

- `App.js`: komplette mobile App-Oberflaeche, Theme-Logik, Interaktion, Fortschritt und Run-History
- `src/data/cases.js`: Fallbibliothek mit Lernzielen, Schritten, Fragen, Punktwerten und Ressourcen
- `src/lib/progress.js`: Hilfsfunktionen fuer Fortschritt und Bewertung
- `app.json`: Expo-Metadaten, App-Schema, Splash, iOS- und Android-Konfiguration
- `package.json`: Startskripte und Abhaengigkeiten

## Lokal starten

### Voraussetzungen

- Node.js installiert
- npm verfuegbar
- Expo Go auf einem iPhone oder Android-Geraet

### Installation

```bash
cd mobile
npm install
```

### Entwicklungsserver starten

```bash
npx expo start
```

Danach:

1. Expo Go auf dem Geraet oeffnen
2. den QR-Code aus dem Terminal oder Browser scannen

Alternativ stehen diese Scripts zur Verfuegung:

```bash
npm run ios
npm run android
npm run web
```

## Expo-Konfiguration

Die App ist aktuell so konfiguriert:

- Name: `BissTrainer`
- Slug: `biss-trainer`
- Orientation: `portrait`
- UI-Style: `automatic`
- URL-Scheme: `bisstrainer`
- iOS Bundle Identifier: `de.moetz.bisstrainer`
- Android Adaptive Icon und Splash-Screen sind gesetzt

Damit ist der Prototyp direkt fuer lokale Demo- und Device-Tests vorbereitet.

## Datenmodell

Jeder Fall besteht aus:

- Metadaten wie `id`, `title`, `patient`, `difficulty`, `duration`, `model`
- `resources[]` fuer Lernmedien und Modellbezug
- `learningGoals[]`
- `steps[]` fuer die klinische Sequenz

Jeder Schritt enthaelt:

- `phase`
- `title`
- `prompt`
- `findings[]`
- `cheatSheet[]`
- `question.text`
- `question.options[]`

Jede Antwortoption traegt:

- `label`
- `correct`
- `rationale`
- `points`

Das Datenmodell ist absichtlich flach gehalten, damit neue Faelle schnell eingepflegt oder fuer Demos ausgetauscht werden koennen.

## App-Verhalten

Die mobile Variante ist als eine zusammenhaengende, scrollbare Trainingsoberflaeche gebaut.

Im Kern passiert Folgendes:

1. Die App laedt die Fallbibliothek.
2. Ein aktiver Fall wird ausgewaehlt.
3. Pro Schritt kann genau eine Antwort gegeben werden.
4. Nach einer Antwort wird fachliches Feedback eingeblendet.
5. Punkte werden fuer richtige klinische Priorisierung vergeben.
6. Wenn alle Faelle abgeschlossen sind, wird ein kompletter Durchlauf in der lokalen Historie gespeichert.

## Persistenz

Aktuell wird lokal in AsyncStorage gespeichert:

- Run-History abgeschlossener Gesamtdurchlaeufe
- letzte lokal erzeugte Run-ID

Verwendeter Storage-Key:

- `biss-trainer-run-history-v1`

Wichtig:

- Der laufende Fortschritt innerhalb einer Session ist aktuell vor allem im React-State gehalten.
- Die mobile README aus dem fruehen Stand nannte Persistenz als naechsten Schritt; inzwischen existiert zumindest eine lokale Run-History.
- Ein vollstaendiges, robustes Speichern des gesamten Fallfortschritts pro Nutzer:in ist noch kein final ausgebautes Feature.

## UX-Charakter

Die App ist nicht als klassische Formular-App gedacht, sondern als kompakte Lernflaeche mit:

- grossen touchfaehigen Karten
- klarer Schrittlogik
- unmittelbarer Rueckmeldung
- sichtbarem Score- und Fortschrittskontext
- heller und dunkler visueller Sprache

Das Layout ist damit auf schnelle Nutzung in Lehrsituationen, Demo-Situationen und kurze Trainingsdurchlaeufe ausgelegt.

## Bekannte Grenzen

Der aktuelle Stand ist ein Prototyp. Noch nicht enthalten sind:

- echtes Benutzerkonto oder Login
- serverseitige Synchronisierung
- gemeinsames Backend fuer Rankings oder Kursgruppen
- Upload und Verwaltung realer Medien wie Roentgenbilder oder Videos
- Tutor:innenmodus
- final vereinheitlichte Inhaltsquelle mit der Web-App
- automatisierte Tests fuer UI und Trainingslogik

Ausserdem:

- Die App ist ein Lern- und Demo-Prototyp.
- Sie ist kein Medizinprodukt und keine klinische Entscheidungssoftware.

## Inhalte erweitern

Neue Faelle werden derzeit direkt in `src/data/cases.js` gepflegt.

Empfohlenes Vorgehen:

1. Fall anhand des Templates im Root unter `docs/case-template.md` strukturieren
2. Lernziele, Befunde, Fragen und Rationales fachlich abstimmen
3. Modellbezug und Medienverweise sauber eintragen
4. Punktevergabe auf klinische Priorisierung ausrichten

## Naechste sinnvolle Schritte

- vollständige Persistenz fuer aktiven Fallfortschritt via AsyncStorage ausbauen
- Web- und Mobile-Datenmodell zusammenfuehren
- Medienmodule pro Fall integrieren
- Kohorten-, Tutor:innen- und Ranking-Funktionen anbinden
- App in kleinere Komponenten zerlegen, damit die Oberflaeche leichter wartbar wird
- spaeter Dev Client oder native Builds fuer TestFlight und Play Store vorbereiten

## Bezug zum Root-Projekt

Dieses `mobile/`-Verzeichnis ist kein unabhaengiges Produkt, sondern der native Client fuer denselben BissTrainer-Prototyp im Root-Repository.

Wenn du den Gesamtzusammenhang suchst:

- Root-README beschreibt Produktbild und Web/PWA-Variante
- `docs/concept.md` beschreibt die Produktidee
- `docs/case-template.md` beschreibt das Raster fuer neue Trainingsfaelle
