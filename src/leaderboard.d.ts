interface LeaderboardBracket {
    alltime?: LeaderboardItem[];
    weekly?: LeaderboardItem[];
    monthly?: LeaderboardItem[];
}

interface LeaderboardItem {
    rank: number;
    value: number;
    server: string;
    date: string;
}

interface LeaderboardCategory {
    [key: string]: string[];
}

interface LeaderboardAPIResponse {
    [key: string]: string;

    data: LeaderboardItem[];
    name: string;
}