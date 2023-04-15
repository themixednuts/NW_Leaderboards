interface LeaderboardAPIItem {
    rank: number;
    value: number;
    server: string;
    date: string;
}

interface LeaderboardAPIResponse {
    [key: string]: string;
    data: LeaderboardAPIItem[];
    name: string;
}