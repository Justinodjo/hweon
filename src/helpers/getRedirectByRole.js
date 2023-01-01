export default function getRedirectByRole(roles = []) {
  const roleRedirectMap = {
    ADMIN_ROLES: "/admin",
    MANAGER_ROLES: "/manager/manager_dashboard",
    SUPER_ADMIN_ROLES: "/master/master_dashboard",
    LOCATAIRE_ROLES: "/Locataire/locataire_dashboard",
    NOTARY_ROLES: "/notary/notary_dashboard",
    SUPPLIER_ROLES: "/supplier/supplier_dashboard",
    PROPRIETAIRE_ROLES: "/proprietaire/proprietaire_dashboard",
  };

  if (!Array.isArray(roles) || roles.length === 0) {
    return "/home"; // Valeur par défaut si aucun rôle fourni
  }

  for (const role of roles) {
    if (Object.prototype.hasOwnProperty.call(roleRedirectMap, role)) {
      return roleRedirectMap[role];
    }
  }

  return "/home"; // Aucun rôle trouvé
}
