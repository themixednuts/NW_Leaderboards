import { validSeasons, type ValidSeason } from "../routes/lb/utils";

export function match(seasonId: string): seasonId is ValidSeason {
    return validSeasons.includes(seasonId.toLowerCase() as ValidSeason)
}