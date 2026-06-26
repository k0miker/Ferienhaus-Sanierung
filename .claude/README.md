# .claude/

Projektbezogene Konfiguration für **Claude Code** in diesem Repository.

- Die inhaltlichen Arbeitsregeln stehen in [`../CLAUDE.md`](../CLAUDE.md) und
  [`../AGENTS.md`](../AGENTS.md).
- Eigene Slash-Commands könnten als `commands/<name>.md` hier abgelegt werden.
- Berechtigungen/Settings (`settings.json`) bitte über den Befehl `/update-config`
  oder `/fewer-permission-prompts` einrichten – so werden z. B. `npm run dev`,
  `npm run cms` und Git-Lesebefehle ohne Rückfrage erlaubt. (Claude darf seine
  eigenen Berechtigungen nicht unaufgefordert erweitern, daher nicht automatisch
  angelegt.)
