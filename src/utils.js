export function getBackendUrl() {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port+1}`;
}
