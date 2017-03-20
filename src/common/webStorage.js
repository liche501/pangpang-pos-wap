export function getLocalStorage(key) {
    return localStorage.getItem(key);
}

export function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}

export function setLocalStorage(key, value) {
    return localStorage.setItem(key, value);
}

export function setSessionStorage(key, value) {
    return sessionStorage.setItem(key, value);
}
