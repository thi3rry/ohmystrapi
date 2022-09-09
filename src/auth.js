import jwt_decode from "jwt-decode";
import {useStorage} from "./useStorage.js";


export const AUTH_TOKEN = "token";
export const storage = useStorage();

export function resetAuthToken() {
    storage.removeItem(AUTH_TOKEN);
}
export function setAuthToken(token) {
    storage.setItem(AUTH_TOKEN, token)
}
export function getAuthToken() {
    return storage.getItem(AUTH_TOKEN)
}

export function getAuthHeaders() {
    const token = getAuthToken();
    const Authorization = token ? `Bearer ${token}` : ''
    const authorizationHeader = Authorization ? { Authorization } : {}
    return authorizationHeader;
}

export function decodeToken(token = null) {
    if (token ===  null) {
        token = getAuthToken();
    }
    return jwt_decode(token);
}

export function isTokenExpired(token = null) {
    if (token ===  null) {
        token = getAuthToken();
    }
    const decoded = decodeToken(token);
    return decoded.exp < Date.now()/1000;
}

export function isTokenValid({token = null, checkExpiration = true}) {
    if (token ===  null) {
        token = getAuthToken();
    }
    try {
        const hasId = Boolean(!!decodeToken(token)?.id);
        return checkExpiration ? hasId && !isTokenExpired(token) : hasId;
    }
    catch (e) {
        return false;
    }
}


