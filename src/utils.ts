export function formatNumberToSI(number: number) {
    const units = ["", "K", "M", "B", "T"];
    const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
    const value = number / Math.pow(1000, unitIndex);

    return value.toFixed(2) + units[unitIndex];
}

