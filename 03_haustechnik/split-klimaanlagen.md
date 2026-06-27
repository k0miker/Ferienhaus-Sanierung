# Split-Klimaanlagen / Luft-Luft-Waermepumpen

## Aktueller Stand

**Entschieden (2026-06-27):** Split-Multisplit als Hauptheizung. Siehe ADR-002.

## Vorteile

- vergleichsweise geringe Investition
- keine Heizungsrohre notwendig
- Kühlung im Sommer möglich
- schnelle Wärmebereitstellung
- gut mit PV-Eigenstrom kombinierbar

## Risiken / Nachteile

- **Wärmeverteilung bei geschlossenen Türen** → je separater Raum tendenziell ein Innengerät
- Luftbewegung, Geräusch (innen und außen)
- separates Warmwassersystem erforderlich
- Förderkulisse für Luft-Luft-WP schwächer als für Luft-Wasser-WP (prüfen)

## Vorläufiges Aufstellungskonzept [ANNAHME]

> Grundlage: Raumdaten aus `01_bestand/grundrisse/grundriss-vorlaeufig.md` (alle [ABGELESEN]).
> **Noch keine Heizlast** vorhanden → Stückzahl/Leistung sind eine begründete Arbeitshypothese,
> **keine Auslegung**. Erst Hülle sanieren, dann raumweise Heizlast rechnen.

### Erdgeschoss

| Raum | Fläche | Vorschlag | Begründung |
|---|---:|---|---|
| Wohnen + Küche (nach Durchbruch offen) | ca. 23,4 + 5,3 m² | **1 Innengerät** | Größte zusammenhängende Zone; Gerät hoch an einer Wand, die den Raum bestreicht, nicht direkt auf Sitzplätze/Essbereich blasend |
| Schlafen | ca. 13,4 m² | **1 Innengerät** | Eigener, oft geschlossener Raum; Nachts Leise-/Flüstermodus wichtig |
| Diele / Treppe | ca. 11,1 m² | optional / keins | Über offene Treppe steigt Wärme nach oben; eigenes Gerät nur falls als Aufenthalt genutzt |
| Bad/WC | ca. 5,6 m² | **kein Split** | Wärme besser über elektr. Fußbodenheizung/Handtuchheizkörper (siehe `04_innenausbau/bad.md`) |

### Obergeschoss [WIDERSPRUCH – Nutzung klären]

Der Grundriss `Grundriss.png` zeigt **rechts ein Obergeschoss mit Räumen** (ca. 27,3 / 23,4 /
7,2 / 5,1 m²). Das **widerspricht** dem Bauunterlagen-Begriff „nicht ausgebautes Dachgeschoss".

- **Wenn OG beheizter Wohnraum ist:** je großem Raum **1 Innengerät** (also ~2 Geräte für die
  beiden großen Räume), kleine Räume ggf. über Türen mitversorgt.
- **Wenn OG unbeheizter Speicher bleibt:** keine Geräte oben, dafür oberste Geschossdecke dämmen.

→ **Erst klären: Ist das OG Wohnfläche oder Dachboden?** (entscheidet Geräteanzahl und
Dämmkonzept, siehe `02_gebaeudehuelle/dach-daemmung.md`).

### Außengerät(e)

- **Multisplit** (1 Außengerät für mehrere Innengeräte) spart Fassadenfläche; Alternative
  mehrere Single-Splits.
- Aufstellort: tragfähige Fassade/Boden, **schallarm Richtung Nachbarn**, Kondensatableitung
  frostsicher, Wartungszugang, nicht direkt unter/neben Schlafzimmerfenster.
- Leitungslängen und Kernbohrungen kurz halten; Lage mit Durchbruch-/Elektroplanung abstimmen.

## Offene Fragen

- OG-Nutzung (Wohnraum oder Speicher)?
- Raumweise Heizlast nach Hüllensanierung?
- Konkrete Gerätepositionen (Möblierung, Fenster, Türen, Sichtachsen)?
- Schallnachweis außen (Nachbarschaft)?
- Elektro-Anschlussleistung ausreichend (mit Elektro-Bestand abgleichen)?
- Warmwasser separat (Durchlauferhitzer/BWWP)?

## Nächste Schritte

1. OG-Nutzung und Türsituation klären.
2. Hüllenmaßnahmen festlegen → raumweise Heizlast rechnen lassen.
3. Auf dieser Basis Stückzahl/Leistung auslegen und Angebote einholen (z. B. Geske, Santel,
   Haverkamp – siehe `09_bauablauf/handwerkerkontakte.md`).
