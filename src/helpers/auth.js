import Cookies from "js-cookie";

const TokenKey = "token";
const RolesKey = "roles";
const UserInfoKey = "userInfo";
const EmailKey = "email";
const UserNameKey = "userName";
const SecondNameKey = "secondName";
const RefreshTokenKey = "refreshToken";
const FichierKey = "fichier";
const PermissionsKey = "permissions";
const ConsentKey = "cookieConsent";
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {
    secure: false,
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
  return Cookies.set(RolesKey, JSON.stringify(roles), {
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
  return Cookies.set(PermissionsKey, JSON.stringify(permissions), {
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
  return Cookies.set(FichierKey, fichier, {
    secure: true,
    sameSite: "Strict",
    expires: 1,
  });
}
export function getFichier() {
  return Cookies.get(FichierKey);
}
export function removeFichier() {
  return Cookies.remove(FichierKey);
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
export function getConsent() {
  return Cookies.get(ConsentKey);
}

export function setConsent(status) {
  return Cookies.set(ConsentKey, status, {
    secure: true,
    sameSite: "Strict",
    expires: 365,
  });
}

export function removeConsent() {
  return Cookies.remove(ConsentKey);
}
