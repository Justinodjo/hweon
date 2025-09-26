import Cookies from "js-cookie";

const TokenKey = "d7542a8f";
const RolesKey = "d7542a8f_roles";
const UserInfoKey = "d7542a8f_userInfo";
const EmailKey = "d7542a8f_email";
const UserNameKey = "d7542a8f_userName";
const SecondNameKey = "d7542a8f_secondName";
const RefreshTokenKey = "d7542a8f_refreshToken";
const FichiersKey = "d7542a8f_fichiers";
const PermissionsKey = "d7542a8f_permissions";
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getRoles() {
  return Cookies.get(RolesKey);
}

export function setRoles(roles) {
  return Cookies.set(RolesKey, roles, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function removeRoles() {
  return Cookies.remove(RolesKey);
}

export function getPermissions() {
  return Cookies.get(PermissionsKey);
}

export function setPermissions(permissions) {
  return Cookies.set(PermissionsKey, permissions, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function removePermissions() {
  return Cookies.remove(PermissionsKey);
}

export function getUserInfo() {
  return Cookies.get(UserInfoKey);
}
export function setUserInfo(userInfo) {
  return Cookies.set(UserInfoKey, userInfo, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}
export function removeUserInfo() {
  return Cookies.remove(UserInfoKey);
}
export function setFichier(fichier) {
  return Cookies.set(FichiersKey, fichier, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}
export function getFichier() {
  return Cookies.get(FichiersKey);
}
export function removeFichier() {
  return Cookies.remove(FichiersKey);
}

export function removeEmail() {
  return Cookies.remove(EmailKey);
}

export function getEmail() {
  return Cookies.get(EmailKey);
}

export function setEmail(email) {
  return Cookies.set(EmailKey, email, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function removeUserName() {
  return Cookies.remove(UserNameKey);
}

export function getUserName() {
  return Cookies.get(UserNameKey);
}

export function setUserName(userName) {
  return Cookies.set(UserNameKey, userName, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function removeSecondName() {
  return Cookies.remove(SecondNameKey);
}

export function getSecondName() {
  return Cookies.get(SecondNameKey);
}

export function setSecondName(secondName) {
  return Cookies.set(SecondNameKey, secondName, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken, {
    secure: true,
    sameSite: "Strict",
    expires: 7, // Durée de validité du refresh token, par exemple 7 jours
  });
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey);
}
