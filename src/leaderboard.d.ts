interface LeaderboardAPIBoardItem {
    rank: number;
    value: number;
    server: string;
    date: string;
}

interface LeaderboardAPIBoardResponse {
    [key: string]: string;
    data: LeaderboardAPIBoardItem[];
    name: string;
}

interface LeaderboardAPIUserItem {
    [key: string]: string;
    count: string;
}

interface LeaderboardAPIUserResponse {
    [key: string]: string;
    data: LeaderboardAPIUserItem[];
}
