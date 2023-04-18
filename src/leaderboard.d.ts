interface LeaderboardAPIBoardItem {
    rank: number;
    value: number;
    server: string;
    date: string;
}

interface LeaderboardAPIBoardResponse {
    [key: string]: string;
    data: LeaderboardAPIBoardItem[];
}

interface LeaderboardAPIUserItem {
    [key: string]: string;
    count: string;
}

interface LeaderboardAPIUserResponse {
    [key: string]: string;
    data: LeaderboardAPIUserItem[];
}

interface LeaderboardAPILegendaryItem {
    [key: string]: string;
    count: string;
}

interface LeaderboardAPILegendaryResponse {
    [key: string]: string;
    data: LeaderboardAPILegendaryItem[];
}

interface LeaderboardAPIBreachesItem {
    [key: string]: string;
    count: string;
}

interface LeaderboardAPIBreachesResponse {
    [key: string]: string;
    data: LeaderboardAPIBreachesItem[];
}