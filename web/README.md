# Webansicht

Die Datei `index.html` ist eine statische lokale Projektzentrale fuer das Sanierungsprojekt.

## Oeffnen

Empfohlen ist ein lokaler Server, damit der integrierte Markdown-Viewer Dateien laden kann:

```text
python3 -m http.server 4173
```

Dann im Browser oeffnen:

```text
http://localhost:4173/web/
```

Wenn `web/index.html` direkt per `file://` geoeffnet wird, koennen Markdown-Dateien je nach Browser nicht per JavaScript geladen werden. Dann erscheinen sie beim direkten Oeffnen weiterhin als Rohtext.

## Markdown-Viewer

Interne Links auf `.md`-Dateien werden in der Webseite abgefangen und in einem Dialog als lesbares HTML angezeigt. Der Button "Original oeffnen" fuehrt weiterhin zur Quelldatei.

## Grundriss

Aktuell wird `01_bestand/grundrisse/Grundriss.png` als nachgebauter Arbeitsgrundriss angezeigt. Originalplan, Planfoto und Vor-Ort-Aufmass bleiben die Pruefgrundlage.
