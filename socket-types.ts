import { Guess, TileCount } from "@/app/components/GameBoard/GameBoard"
import { DailyInfo } from "@/lib/redis";

/* Generic types used in Message Types below */
export type UserName = string;
export type Code = string;
export type Score = number; //  Scored points from a round.
export type Points = number; // Total points in the game

export type MultiplayerUser = {
  guessInfo: [Guess, TileCount]
  points: Points,
}

export type MultiplayerGame = {
  [users: UserName]: MultiplayerUser
}

export type MultiplayerData = {
  [games: Code]: MultiplayerGame
}

// List of countries previously selected for rounds in the game and round number
export type MultiplayerBookkeeping = {
    [games: Code]: {
        previouslySelected: string[];
        roundNumber: number;
        started: boolean;
        population: number;
        roundEnded: boolean;  // Don't double scores/roundNumber or initiation sequence via the roundEnded boolean
    }
}

type EmptyString = "";

/* Message Body Types (See socket-messages for the message titles) */
export type PLAYERS_BODY = MultiplayerGame;
export type START_REQUEST_BODY = Code;
export type START_BODY = EmptyString;
export type ROUND_INFO_BODY = DailyInfo;
export type ROUND_START_BODY = EmptyString;
export type ROUND_END_BODY = EmptyString;
export type GUESS_BODY = [UserName, Guess];
export type SCORE_INFO_BODY = [UserName, Score][]; // Sorted by Score in decreasing order.
export type PLAYERS_UPDATE_BODY = MultiplayerGame;
export type ROUND_INTERLUDE_BODY = EmptyString;
export type GUESS_MADE_BODY = [UserName, Guess];
export type GUESS_UPDATE_BODY = GUESS_MADE_BODY;
export type GAME_END_BODY = EmptyString;