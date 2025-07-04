export function getBackendUrl() {
    return `${window.location.protocol}//${window.location.hostname}:${parseInt(window.location.port)+1}`;
}
