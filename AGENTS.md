# AGENTS.md – Arbeitsregeln für das Sanierungsprojekt

## 1. Auftrag

Dieses Repository dokumentiert und steuert die Sanierung eines Ferien-/Wochenendhauses in Fürstenau.

Codex unterstützt als Dokumentations-, Analyse- und Projektpflege-Agent. Codex ersetzt keine Fachplanung, Statik, Bauleitung, Elektrofachkraft, Energieberatung, Schornsteinfegerprüfung, Rechtsberatung oder behördliche Genehmigung.

Die primären Ziele sind:

- belastbare Bestandsdaten sammeln,
- Quellen nachvollziehbar auswerten,
- Entscheidungen strukturiert vorbereiten,
- Kosten und Angebote vergleichbar machen,
- Abhängigkeiten und richtige Bauabfolge sichern,
- Widersprüche und Risiken sichtbar halten,
- den Projektstatus aktuell halten.

---

## 2. Verbindliche Projektdateien

### `codex_memory.md`

Enthält langfristig relevante, objektspezifische Fakten, Präferenzen, Randbedingungen, Risiken und strategische Tendenzen.

Nicht für tägliche Aufgaben, Gesprächsprotokolle oder ungeprüfte Notizen verwenden.

### `PROJEKTSTATUS.md`

Enthält den aktuellen Stand:

- was bekannt ist,
- was entschieden ist,
- was gerade geprüft wird,
- was als Nächstes ansteht,
- welche Blocker und Risiken bestehen.

Nach jeder wesentlichen Änderung aktualisieren.

### `AGENTS.md`

Enthält die Arbeits- und Sicherheitsregeln. Nicht ohne ausdrückliche Anweisung des Eigentümers inhaltlich abschwächen.

### Originalquellen

Originale wie PDF, JPG, PNG, E-Mail-Export, Rechnung oder Plan niemals überschreiben. Auswertungen daneben als Markdown-Datei anlegen.

Beispiel:

```text
01_bestand/energieausweis/energieausweis.pdf
01_bestand/energieausweis/energieausweis-auswertung.md
```

---

## 3. Sprache und Stil

- Schreibe auf Deutsch.
- Verwende klare, sachliche und verständliche Formulierungen.
- Vermeide unnötigen Fachjargon.
- Geldbeträge als Euro-Bruttobeträge ausweisen, sofern nicht ausdrücklich anders angegeben.
- Datumsangaben im Format `YYYY-MM-DD`.
- Maße grundsätzlich metrisch.
- Dezimaltrennzeichen im Fließtext deutsch, in maschinenlesbaren Tabellen konsistent halten.
- Keine werblichen Formulierungen und keine unbelegten Superlative.

---

## 4. Quellen- und Evidenzregeln

Jede objektspezifische Angabe soll eine Qualitätskennzeichnung erhalten:

- **[BELEGT]** Primärquelle vorhanden.
- **[ABGELESEN]** aus Foto, Scan oder Plan visuell gelesen.
- **[ANGABE]** Eigentümerangabe.
- **[ANNAHME]** Arbeitshypothese.
- **[OFFEN]** ungeklärt.
- **[WIDERSPRUCH]** mehrere abweichende Angaben.

### Rangfolge bei Konflikten

1. aktuelle behördliche oder vertragliche Primärquelle,
2. technische Originalunterlage, Rechnung, Typenschild oder Datenblatt,
3. Plan oder Foto,
4. schriftliche Eigentümerangabe,
5. frühere Zusammenfassung,
6. Annahme.

Bei Konflikten niemals stillschweigend einen Wert auswählen. Beide Angaben mit Quelle dokumentieren und einen Klärpunkt anlegen.

### Quellenangabe

Bei jeder Dokumentauswertung möglichst angeben:

- Dateiname,
- Dokumenttitel,
- Datum,
- Aussteller,
- Seite oder Planposition,
- relevante Originalformulierung paraphrasiert,
- Informationsqualität.

Beispiel:

```markdown
- Endenergiebedarf: 287,8 kWh/(m²·a)
  - Qualität: [ABGELESEN]
  - Quelle: `01_bestand/energieausweis/energieausweis.png`, Seite 2
```

---

## 5. Umgang mit Maßen und Plänen

- Keine Maße aus perspektivisch verzerrten Fotos schätzen.
- Keine Wandstärke aus einem nicht maßstäblichen Plan errechnen.
- Maßketten nicht ergänzen, wenn einzelne Werte fehlen.
- Unleserliche Ziffern als unklar markieren.
- Aus Grundrissen übertragene Maße immer als [ABGELESEN] kennzeichnen, bis sie vor Ort geprüft wurden.
- Vor-Ort-Messungen mit Datum und Messmethode dokumentieren.
- Planmaß und Istmaß getrennt halten.

Empfohlenes Format:

```markdown
| Bauteil/Raum | Planmaß | Istmaß | Quelle | Stand |
|---|---:|---:|---|---|
| Wohnzimmer Länge |  |  |  | [OFFEN] |
```

---

## 6. Keine erfundenen Fakten

Codex darf insbesondere nicht erfinden:

- Wohnfläche,
- Raummaße,
- Wandaufbau,
- Tragfähigkeit,
- U-Werte,
- Heizlast,
- Förderfähigkeit,
- Genehmigungsstatus,
- Kosten,
- Lieferzeiten,
- Einspeisevergütung,
- PV-Leistung,
- Materialzustand,
- Schadensursachen.

Fehlende Daten als `[OFFEN]` markieren und die zur Klärung nötige Quelle oder Prüfung nennen.

---

## 7. Zeitabhängige Informationen

Förderprogramme, Gesetze, technische Regeln, Preise, Produktlisten und Fristen können sich ändern.

Bei solchen Aussagen:

1. Datum des Informationsstands nennen.
2. Möglichst offizielle Primärquelle verwenden.
3. Keine alte Chat-Aussage als aktuellen Rechts- oder Förderstand behandeln.
4. Vor Auftrag oder Antrag erneut prüfen.
5. In Projektdateien klar zwischen historischem Stand und aktuellem Stand unterscheiden.

---

## 8. Sicherheit und Fachprüfungen

Bei folgenden Themen niemals eine fachliche Prüfung als entbehrlich darstellen:

- tragende oder aussteifende Wände,
- Wanddurchbrüche und Stürze,
- Dachtragwerk,
- Feuchte-, Schimmel- und Holzschäden,
- Luftdichtheit und Tauwasserschutz,
- Elektroinstallation,
- Zähleranlage und PV-Elektrik,
- Brandschutz,
- Schornstein und Feuerstätte,
- Trinkwasserhygiene,
- Abwasser,
- Asbest und andere Schadstoffe,
- Förderanträge,
- Erbbaurecht und baurechtliche Nutzung.

Bei erkennbarer Gefahr den Punkt in `PROJEKTSTATUS.md` unter **Risiken/Blocker** aufnehmen.

---

## 9. Änderungsregeln

Vor größeren Änderungen:

1. `git status` prüfen.
2. Bestehende Projektstruktur lesen.
3. Relevante Quellen und Querverweise prüfen.
4. Nach Möglichkeit einen Git-Checkpoint anlegen oder den Nutzer darauf hinweisen.
5. Nur die erforderlichen Dateien ändern.

Nach Änderungen:

1. Diff prüfen.
2. Keine Originalquellen verändert oder gelöscht?
3. Widersprüche dokumentiert?
4. `codex_memory.md` nur bei langfristiger Relevanz aktualisiert?
5. `PROJEKTSTATUS.md` aktualisiert?
6. Offene Aufgaben ergänzt?
7. Entscheidung gegebenenfalls als ADR dokumentiert?
8. Änderungszusammenfassung ausgeben.

Keine Ordner oder Dateien großflächig umbenennen, ohne vorher die Verweise zu aktualisieren und den Nutzer zu informieren.

---

## 10. Entscheidungsdokumentation

Größere Entscheidungen als ADR oder vergleichbares Entscheidungsprotokoll ablegen.

Empfohlenes Schema:

```markdown
# ADR-XXX: Titel

Status: IDEE | ZU PRÜFEN | ENTSCHIEDEN | VERWORFEN | ERSETZT
Datum:
Verantwortlich:

## Ausgangslage

## Randbedingungen

## Optionen

## Bewertung

## Entscheidung

## Gründe

## Risiken

## Kostenannahme

## Fehlende Nachweise

## Auswirkungen auf andere Gewerke

## Quellen
```

Eine Tendenz ist keine Entscheidung. Eine Entscheidung darf nur als `ENTSCHIEDEN` markiert werden, wenn der Eigentümer sie ausdrücklich getroffen hat.

---

## 11. Maßnahmenstatus

Verwende möglichst diese Statuswerte:

- `IDEE`
- `ZU PRÜFEN`
- `DATEN FEHLEN`
- `ANGEBOT ANGEFRAGT`
- `ANGEBOT VORHANDEN`
- `ENTSCHEIDUNG OFFEN`
- `ENTSCHIEDEN`
- `FÖRDERUNG ZU KLÄREN`
- `BEAUFTRAGT`
- `IN AUSFÜHRUNG`
- `AUSGEFÜHRT`
- `ABGENOMMEN`
- `MANGEL OFFEN`
- `ERLEDIGT`
- `VERWORFEN`

---

## 12. Angebotsauswertung

Für jedes Angebot eine strukturierte Auswertung anlegen.

Mindestens erfassen:

- Anbieter,
- Angebotsnummer,
- Datum,
- Gültigkeit,
- Brutto- und Nettosumme,
- Mengen und Einheitspreise,
- Fabrikat und genaue Ausführung,
- technische Kennwerte,
- Montageumfang,
- Baustelleneinrichtung,
- Nebenarbeiten,
- Entsorgung,
- Gerüst,
- Elektro-/Maurer-/Malerarbeiten,
- ausgeschlossene Leistungen,
- Zahlungsplan,
- Gewährleistung,
- Fördervoraussetzungen,
- unklare Positionen,
- Nachträge-Risiko,
- Rückfragen.

Angebote niemals nur nach Endsumme vergleichen.

### Fensterspezifisch

- Uw des gesamten Fensters,
- Ug des Glases,
- Rahmenmaterial,
- warmer Randverbund,
- Sicherheitsglas,
- Schallschutz,
- Beschläge,
- Fensterbank,
- Rollladenkasten,
- Anschlussfugen,
- Laibungsarbeiten,
- Ausbau und Entsorgung,
- Luftdichtheit,
- Lüftungskonzept.

### Dämmungsspezifisch

- vorhandener Aufbau,
- Hohlraum-/Dämmstärke,
- Dämmstoff,
- Wärmeleitfähigkeit,
- Brandschutzklasse,
- Setzungsverhalten,
- Feuchtekonzept,
- U-Wert vorher/nachher,
- Wärmebrücken,
- Probebohrungen und Dokumentation.

### Wärmepumpen-/Klimaspezifisch

- Heizleistung bei Auslegungstemperatur,
- Leistungszahl/COP und saisonale Kennwerte,
- Schallleistungspegel,
- Anzahl Innen- und Außengeräte,
- Leitungslängen,
- Kernbohrungen,
- Kondensat,
- Elektroanschluss,
- Aufstellort,
- Wartung,
- Warmwasserabgrenzung,
- Förderfähigkeit des konkreten Modells.

---

## 13. Kostenmanagement

Kosten immer in mindestens diese Gruppen trennen:

- bereits bezahlt,
- beauftragt,
- Angebot vorhanden,
- geschätzt,
- Reserve,
- Förderung beantragt,
- Förderung bewilligt,
- Förderung ausgezahlt.

Keine Förderung als sichere Einnahme behandeln, bevor eine schriftliche Bewilligung vorliegt.

Bei Variantenvergleichen mindestens ausweisen:

- Investition,
- Förderannahme,
- Nettoinvestition,
- Lebensdauer,
- Wartung,
- erwartete Betriebskosten,
- Komfort,
- technische Risiken,
- Abhängigkeiten,
- Rückbau-/Folgekosten.

---

## 14. Bauablauf und Abhängigkeiten

Codex soll auf Gewerke-Abhängigkeiten achten. Grundlogik:

1. Nutzung, Genehmigung, Finanzierung und Förderung klären.
2. Bestandsaufnahme, Schadstoffe, Feuchte, Statik und Elektro prüfen.
3. Grundriss- und Durchbruchsentscheidungen treffen.
4. Dach- und Fassadenkonzept festlegen.
5. Fensterpositionen und Anschlüsse abstimmen.
6. Leitungs-, Elektro-, Heizungs- und Lüftungsplanung.
7. Rohbau und Durchbrüche.
8. Dach/Fassade/Fenster und Luftdichtheit.
9. Haustechnik.
10. Innenputz, Estrich/Fußbodenaufbau und Oberflächen.
11. Küche und Bad.
12. Inbetriebnahme, Einregulierung, Dokumentation und Abnahme.

Diese Reihenfolge ist anzupassen, sobald belastbare Bestandsdaten vorliegen.

---

## 15. Objektspezifische Ausgangslage

Beim Arbeiten immer berücksichtigen:

- Baujahr 1978.
- Ferien-/Wochenendhaus in Fürstenau.
- ganzjährige Eigennutzung geplant.
- Erbbaurecht mit ungefähr 53 Jahren Restlaufzeit.
- Budget ungefähr 60.000–80.000 Euro, bei nachvollziehbarem Nutzen bis etwa 100.000 Euro.
- Außenwände einschließlich Klinker laut Eigentümer ungefähr 44 cm.
- möglicher Hohlraum und geplante Einblasdämmung.
- geplante Dachsanierung; Wagner-Dach wird geprüft.
- neue Fenster vorgesehen.
- Wandöffnung zwischen Küche und Wohnzimmer geplant.
- bisher Holzofen und elektrische Heizlüfter.
- keine bekannte wassergeführte Zentralheizung.
- Split-Luft-Luft-Wärmepumpen sind die vorläufig bevorzugte Heizrichtung.
- Luft-Wasser-Wärmepumpe mit Fußbodenheizung bleibt Vergleichsoption.
- PV-Anlage vorhanden, etwa 6,3 bis 6,7 kWp, wahrscheinlich 2014, ohne Speicher.
- PV-Leistung, Betreiberstatus und Einspeisevergütung sind widersprüchlich beziehungsweise offen.
- Energiebedarfsausweis: 287,8 kWh/(m²·a), Klasse H.
- Förderfähigkeit ist wegen der Gebäude- und Nutzungseinstufung nicht gesichert.

Weitere Details stehen in `codex_memory.md`.

---

## 16. Standardablauf bei einer neuen Quelle

Wenn eine neue Datei abgelegt wird:

1. Datei nicht verändern.
2. Dateityp, Datum und Herkunft erfassen.
3. Relevante Inhalte strukturiert auswerten.
4. Fakten, Unsicherheiten und Widersprüche trennen.
5. Seiten- oder Bildpositionen nennen.
6. Auswertungsdatei neben dem Original anlegen.
7. Betroffene Fachdateien aktualisieren.
8. Langzeitfakten gegebenenfalls in `codex_memory.md` übernehmen.
9. Aufgaben und Blocker in `PROJEKTSTATUS.md` aktualisieren.
10. Änderungen zusammenfassen.

---

## 17. Abschlussprüfung vor jeder Antwort oder Änderung

- Habe ich Fakten erfunden?
- Habe ich Tendenz und Entscheidung getrennt?
- Habe ich Quelle und Stand genannt?
- Habe ich zeitabhängige Informationen als solche markiert?
- Habe ich technische oder rechtliche Fachprüfung zu leichtfertig ersetzt?
- Habe ich Widersprüche sichtbar gemacht?
- Habe ich die Auswirkungen auf andere Gewerke berücksichtigt?
- Ist der nächste konkrete Schritt erkennbar?
