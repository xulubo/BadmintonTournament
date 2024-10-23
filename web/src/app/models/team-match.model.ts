export interface TeamMatch {
  id: number;
  matchNumber: number;
  matchDateTime: string;
  teams: {
    team: {
      id: number;
      name: string;
    };
    totalWins: number;
  }[];
}
