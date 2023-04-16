export function formatNumberToSI(number: number) {
    const units = ["", "K", "M", "B", "T"];
    const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
    const value = number / Math.pow(1000, unitIndex);

    return value.toFixed(2) + units[unitIndex];
}

export async function getUniqueUserData() {
    const response = await fetch(`https://lb.jakel.rocks/users`);

    if (response.status !== 200) {
        throw new Error("Unique users not found");
    }
    const data: LeaderboardAPIUserResponse = await response.json();

    return data;
}

export async function getLegendaryData() {
    const response = await fetch(`https://lb.jakel.rocks/legendaries/s1`);

    if (response.status !== 200) {
        throw new Error("Legendary data not found");
    }
    const data: LeaderboardAPILegendaryResponse = await response.json();

    return data;
}

export async function getBreachesData() {
    const response = await fetch(`https://lb.jakel.rocks/breaches/s1`);

    if (response.status !== 200) {
        throw new Error("Breaches data not found");
    }
    const data: LeaderboardAPIBreachesResponse = await response.json();

    return data;
}