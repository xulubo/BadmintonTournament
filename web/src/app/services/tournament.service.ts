import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.apiUrl}/tournament`);
  }

  getTournamentTeams(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/team`);
  }

  getTeamDetails(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team/${teamId}`);
  }

  getTeamPlayers(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team/${teamId}/player`);
  }

  addPlayer(playerName: string, teamId: number, gender: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/player`, { name: playerName, teamId: teamId, gender: gender });
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/player/${playerId}`);
  }

  createTeamMatch(tournamentId: number, matchData: any): Observable<any> {
    console.log("matchData", matchData);
    return this.http.post(`${this.apiUrl}/team_match`, matchData);
  }

  getTournamentTeamMatches(tournamentId: number): Observable<any[]> {
    console.log(`Fetching team matches for tournament ${tournamentId}`);
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/team_match`)
      .pipe(
        tap(
          data => console.log('Team matches data received:', data),
          error => console.error('Error fetching team matches:', error)
        ),
        map(matches => matches.map(match => ({
          id: match.id,
          teams: match.teams.map((team: any) => ({
            id: team.id,
            name: team.team.name
          }))
        })))
      );
  }

  getTeamMatchDetails(teamMatchId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team_match/${teamMatchId}`);
  }

  createSingleMatch(teamMatchId: number, singleMatchData: any): Observable<any> {
    console.log("singleMatchData", singleMatchData);
    console.log("json", JSON.stringify(teamMatchId));
    return this.http.post(`${this.apiUrl}/match`, singleMatchData);
  }

  updateTeamMatchNumber(teamMatchId: number, matchNumber: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/team_match/${teamMatchId}/match_number`, { matchNumber });
  }

  deleteTeamMatch(teamMatchId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/team_match/${teamMatchId}`);
  }
}
