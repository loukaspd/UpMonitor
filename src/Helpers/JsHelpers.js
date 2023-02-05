export function dateToStringHhMmSs(date) {
    return alwaysTwoDigits(date.getHours()) + ":" + alwaysTwoDigits(date.getMinutes()) + ":" + alwaysTwoDigits(date.getSeconds());
}

function alwaysTwoDigits(n) {
    return n < 10 ? "0" + n : n;
}