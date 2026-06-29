/**
 * Rollen-Sichten: das Portal als Schnittstelle zwischen Besitzer, Bauleitung,
 * Energieberater und Handwerkern. Jede Rolle bekommt eine kuratierte Seite
 * (/fuer/<key>) mit den für sie relevanten Werkzeugen und Dokumenten – kein
 * Login, nur eine aufgeräumte Auswahl. Doc-IDs sind kleingeschrieben (Glob-Loader).
 */

export interface RoleLink {
  href: string;
  label: string;
  icon: string;
  desc?: string;
}

export interface RoleView {
  key: string;
  label: string; // „Bauleitung"
  short: string; // Einstiegskarten-Untertitel
  icon: string;
  tagline: string; // eine Zeile auf der Rollenseite
  /** Welche Live-Kennzahlen oben auf der Rollenseite zeigen. */
  stats: Array<"tasks" | "fragen" | "checklisten" | "budget" | "naechster-termin" | "adrs">;
  /** Primäre Werkzeuge (große Karten). */
  werkzeuge: RoleLink[];
  /** Relevante Dokumente (kompakte Liste). */
  dokumente: RoleLink[];
}

export const ROLES: RoleView[] = [
  {
    key: "bauleitung",
    label: "Bauleitung",
    short: "Ablauf, Termine, Gewerke koordinieren",
    icon: "construction",
    tagline: "Koordination von Terminen, Gewerken und offenen Punkten.",
    stats: ["naechster-termin", "tasks", "fragen", "adrs"],
    werkzeuge: [
      { href: "/zeitplan", label: "Zeitplan", icon: "calendar-days", desc: "Bauzeitenplan & Abhängigkeiten" },
      { href: "/aufgaben", label: "Aufgaben & Fragen", icon: "list-checks", desc: "Backlog, offene Fragen, ADRs" },
      { href: "/kontakte", label: "Kontakte", icon: "contact", desc: "Betriebe je Gewerk" },
      { href: "/kosten", label: "Kosten", icon: "euro", desc: "Budget & Positionen" },
    ],
    dokumente: [
      { href: "/docs/09_bauablauf/bauzeitenplan", label: "Bauzeitenplan", icon: "calendar-days" },
      { href: "/docs/09_bauablauf/abhaengigkeiten", label: "Abhängigkeiten der Gewerke", icon: "layers" },
      { href: "/docs/00_projekt/massnahmenplan", label: "Maßnahmenplan", icon: "layout-grid" },
      { href: "/docs/projektstatus", label: "Projektstatus (Ampel/Blocker)", icon: "clipboard-list" },
    ],
  },
  {
    key: "energieberater",
    label: "Energieberater",
    short: "Gebäudedaten, Hülle, Technik, Förderung",
    icon: "flame",
    tagline: "Gebäudedaten, energetische Hülle, Anlagentechnik und Förderung.",
    stats: ["budget"],
    werkzeuge: [
      { href: "/docs/01_bestand/gebaeudedaten", label: "Gebäudedaten", icon: "ruler", desc: "Baujahr, Flächen, Energiebedarf" },
      { href: "/bereich/02_gebaeudehuelle", label: "Gebäudehülle", icon: "layers", desc: "Dämmung, Fenster, Luftdichtheit" },
      { href: "/bereich/03_haustechnik", label: "Haustechnik", icon: "settings", desc: "Heizung, WP, PV, Warmwasser" },
      { href: "/bereich/07_foerderung", label: "Förderung", icon: "landmark", desc: "BAFA, KfW, Strategie" },
    ],
    dokumente: [
      { href: "/docs/01_bestand/gebaeudedaten", label: "Gebäudedaten & Energiebedarf", icon: "ruler" },
      { href: "/docs/02_gebaeudehuelle/aussenwaende-einblasdaemmung", label: "Außenwände / Einblasdämmung", icon: "layers" },
      { href: "/docs/02_gebaeudehuelle/dach-daemmung", label: "Dachdämmung", icon: "home" },
      { href: "/docs/02_gebaeudehuelle/luftdichtheit-lueftung", label: "Luftdichtheit & Lüftung", icon: "layers" },
      { href: "/docs/03_haustechnik/heizung", label: "Heizung / Wärmepumpe", icon: "flame" },
      { href: "/docs/03_haustechnik/pv-anlage", label: "PV-Anlage", icon: "sun" },
      { href: "/docs/07_foerderung/foerderstrategie", label: "Förderstrategie", icon: "landmark" },
    ],
  },
  {
    key: "handwerker",
    label: "Handwerker",
    short: "Aufmaß, Pläne, dein Gewerk",
    icon: "hammer",
    tagline: "Aufmaß-Checklisten, Pläne und Unterlagen für die Ausführung.",
    stats: ["checklisten", "tasks"],
    werkzeuge: [
      { href: "/checklisten", label: "Checklisten", icon: "square-check", desc: "Aufmaß vor Ort erfassen" },
      { href: "/medien", label: "Pläne & Medien", icon: "image", desc: "Grundrisse, Fotos, PDFs" },
      { href: "/kontakte", label: "Kontakte", icon: "contact", desc: "Ansprechpartner je Gewerk" },
      { href: "/aufgaben", label: "Aufgaben", icon: "list-checks", desc: "Was ansteht" },
    ],
    dokumente: [
      { href: "/docs/01_bestand/aufmass-checklisten", label: "Aufmaß-Checklisten", icon: "ruler" },
      { href: "/docs/01_bestand/schadstellen", label: "Schadstellen", icon: "construction" },
      { href: "/docs/02_gebaeudehuelle/fenster-tueren", label: "Fenster & Türen", icon: "layout-grid" },
      { href: "/docs/02_gebaeudehuelle/fensterliste", label: "Fensterliste", icon: "layout-grid" },
      { href: "/docs/03_haustechnik/elektro", label: "Elektro", icon: "zap" },
    ],
  },
  {
    key: "besitzer",
    label: "Besitzer",
    short: "Gesamtüberblick & Entscheidungen",
    icon: "home",
    tagline: "Der volle Überblick: Status, Budget, Entscheidungen, Förderung.",
    stats: ["budget", "tasks", "fragen", "adrs"],
    werkzeuge: [
      { href: "/", label: "Dashboard", icon: "layout-dashboard", desc: "Ampel, Blocker, Maßnahmen" },
      { href: "/kosten", label: "Kosten", icon: "euro", desc: "Budget & Förderung" },
      { href: "/aufgaben", label: "Entscheidungen", icon: "circle-check", desc: "ADRs & offene Fragen" },
      { href: "/checklisten", label: "Checklisten", icon: "square-check", desc: "Erfassung" },
    ],
    dokumente: [
      { href: "/docs/projektstatus", label: "Projektstatus", icon: "clipboard-list" },
      { href: "/docs/00_projekt/ziele-und-prioritaeten", label: "Ziele & Prioritäten", icon: "compass" },
      { href: "/docs/06_kosten/kostenplan", label: "Kostenplan", icon: "euro" },
      { href: "/docs/07_foerderung/foerderstrategie", label: "Förderstrategie", icon: "landmark" },
    ],
  },
];

export const ROLE_BY_KEY = new Map(ROLES.map((r) => [r.key, r]));
