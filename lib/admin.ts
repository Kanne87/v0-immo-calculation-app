// Admin-Erkennung via Authentik-Gruppen

const ADMIN_GROUP = "immo-admin"

export function isAdmin(groups: string[] | undefined): boolean {
  if (!groups) return false
  return groups.includes(ADMIN_GROUP)
}

// Authentik OIDC Scope erweitern:
// In Authentik unter Applications > Provider > immo-app:
// Scopes muessen 'groups' enthalten (Standard bei Authentik)
// Dann wird im ID-Token das Feld 'groups: ["immo-admin", ...]' mitgeliefert.
//
// Gruppe anlegen:
// Authentik Admin > Directory > Groups > "immo-admin" erstellen
// Kai als Mitglied hinzufuegen
