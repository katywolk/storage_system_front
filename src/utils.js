const DIFF = 1;

export function getBackendUrl(diff = DIFF) {
    return `${window.location.protocol}//${window.location.hostname}:${parseInt(window.location.port)+diff}`;
}
export function getFrontendUrl() {
    return `${window.location.protocol}//${window.location.hostname}:${parseInt(window.location.port)}`;
}
