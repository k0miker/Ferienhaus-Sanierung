---
title: "ADR-002: Heizsystem"
status: "ENTSCHIEDEN"
datum: 2026-06-27
verantwortlich: "Eigentümer"
---

## Fragestellung

Split-Luft-Luft-Wärmepumpen oder ein wassergeführtes Heizsystem?

## Entscheidung

**Split-/Multisplit-Wärmepumpen** als Hauptheizung. Kein wassergeführtes System.

## Begründung

1. **Kein bestehendes wassergeführtes System** – Fußbodenheizung nachzurüsten erfordert
   massiven Eingriff in den Fußbodenaufbau (6–8 cm Aufbau, Türzargen, Treppenstufen).
2. **Unsichere Förderlage** – Förderfähigkeit als Wohngebäude ist [OFFEN] (Ferienhaus,
   Erbbaurecht). Die hohe WP-Förderung (30–70 %) ist nicht gesichert. Split-Geräte
   erhalten ohnehin keine Heizungsförderung, daher kein Fördervorteil für Variante WP+FBH.
3. **Deutlich geringere Investition** – Split ~7.500–13.200 € vs. WP+FBH ~18.500–39.000 €.
   Selbst bei maximaler Förderung für WP+FBH bleibt Split ~5.000–10.000 € günstiger.
4. **PV-Anlage vorhanden** – Split-Geräte nutzen PV-Eigenstrom direkt (heizen und kühlen).
5. **Kühlung inklusive** – bei Ferienhaus-Nutzung im Sommer ein relevanter Vorteil.
6. **Schrittweise umsetzbar** – erst EG, später DG, je nach Budget und DG-Nutzung.
7. **Kein Eingriff in den Fußboden** – Böden können unabhängig vom Heizsystem renoviert werden.

## Randbedingungen

- Bisher kein wassergeführtes Heizsystem im Bestand.
- PV-Anlage vorhanden.
- Ganzjährige Nutzung geplant.
- Investition soll wirtschaftlich bleiben.
- Holzofen vorhanden, wird aber **nicht als Reserve eingeplant** – Kamin soll aus
  Feuchtigkeitsschutzgründen verschlossen werden (Wassereintritt im Schacht dokumentiert).

## Aufstellungskonzept [ANNAHME]

Details siehe `03_haustechnik/split-klimaanlagen.md`. Zusammenfassung:

| Zone | Fläche | Gerät |
|---|---:|---|
| Wohnen + Küche (nach Durchbruch offen) | ~29 m² | 1 Innengerät ~3,5 kW |
| Schlafen | ~13 m² | 1 Innengerät ~2,5 kW (Flüstermodus) |
| DG großer Raum (falls Wohnraum) | ~27 m² | 1 Innengerät ~3,5 kW |
| DG Raum links (falls Wohnraum) | ~23 m² | 1 Innengerät ~2,5 kW |
| Bad | ~6 m² | Elektrische FBH-Matte (kein Split) |

Diele/Treppe wird über angrenzende Räume und das offene Treppenhaus mitversorgt.

## Reserve-Heizung

Statt Holzofen: **Infrarot-Paneele** als Reserve/Zusatzheizung für Extremfälle.

Vorteile gegenüber Holzofen:
- Kein Kamin/Schornstein nötig → Kaminschacht kann verschlossen werden
- Wartungsfrei, kein Brennstoff, kein Rußbrand-Risiko
- Flach, platzsparend (Wand- oder Deckenmontage)
- Gut mit PV-Eigenstrom nutzbar
- Schnelle Strahlungswärme, angenehm

Sinnvolle Positionen:
- Bad: 1× 400–600 W (Handtuchtrockner-Paneel) – ergänzt die elektr. FBH
- Diele/Flur: 1× 300–500 W – Frostschutz und Grundwärme
- Ggf. Schlafzimmer: 1× 400 W – für besonders kalte Nächte als Ergänzung

Kosten: ~300–800 € für 2–3 Paneele, einfache Montage (Steckdose/Festanschluss).

## Kamin verschließen

Der vorhandene Kaminschacht soll verschlossen werden:
- **Grund:** Wassereintritt im Schacht dokumentiert (vermutlich Schlagregen trotz Kaminhut),
  Risiko für Feuchteschäden an der frischen Renovierung.
- **Maßnahme:** Schornsteinfeger informieren, Kamin stillegen lassen, Schachtöffnung
  im Wohnraum dicht verschließen (Gipsplatte oder Blechabdeckung mit Dichtung).
- **Dach:** Kaminkopf mit Regenschutzhaube abdecken oder rückbauen (Kosten prüfen).
- **Belüftung:** Kleine Belüftungsöffnung im Schacht belassen, damit keine Staunässe
  entsteht (Schornsteinfeger berät hierzu).

## Warmwasser

Separat über Durchlauferhitzer (dezentral) oder Brauchwasser-Wärmepumpe.
→ Eigene Entscheidung in `03_haustechnik/warmwasser.md`.

## Verworfene Alternative

**Option B: Luft-Wasser-Wärmepumpe + Fußbodenheizung** – technisch besser (Effizienz,
Komfort, Warmwasser integriert), aber:
- Deutlich teurer (~18.500–39.000 € vs. ~7.500–13.200 €)
- Massiver baulicher Eingriff in alle Fußböden
- Fördervorteil nur bei bestätigter Förderfähigkeit – diese ist [OFFEN]
- Komplexeres System mit höherem Wartungsaufwand

## Nächste Schritte

1. OG-Nutzung klären (Wohnraum oder Speicher?) → bestimmt Anzahl Innengeräte.
2. Hüllenmaßnahmen festlegen → raumweise Heizlast berechnen lassen.
3. Schornsteinfeger kontaktieren → Kamin stilllegen und verschließen.
4. 2–3 Angebote für Multisplit-Anlage einholen (z. B. Geske, Santel, Haverkamp).
5. Infrarot-Paneele als Reserve mitplanen und in Elektroplanung berücksichtigen.
