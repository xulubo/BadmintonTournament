import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    } else {
      // Use the same host as the web app
      return `${window.location.protocol}//${window.location.host}/api`;
    }
  }

  private getHeaders(): HttpHeaders {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
      return new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`);
    }
    return new HttpHeaders();
  }

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.apiUrl}/tournament`, { headers: this.getHeaders() });
  }

  getTournamentTeams(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/team`, { headers: this.getHeaders() });
  }

  getTeamDetails(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team/${teamId}`, { headers: this.getHeaders() });
  }

  getTeamPlayers(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team/${teamId}/player`, { headers: this.getHeaders() });
  }

  addPlayer(playerName: string, teamId: number, gender: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/player`, { name: playerName, teamId: teamId, gender: gender }, { headers: this.getHeaders() });
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/player/${playerId}`, { headers: this.getHeaders() });
  }

  createTeamMatch(tournamentId: number, matchResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/team_match`, matchResult, { headers: this.getHeaders() });
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
            id: team.team.id,
            name: team.team.name,
            totalWins: team.totalWins
          }))
        })))
      );
  }

  getTeamMatchDetails(teamMatchId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team_match/${teamMatchId}`, { headers: this.getHeaders() });
  }

  createSingleMatch(teamMatchId: number, singleMatchData: any): Observable<any> {
    console.log("singleMatchData", singleMatchData);
    console.log("json", JSON.stringify(singleMatchData));
    return this.http.post(`${this.apiUrl}/match`, singleMatchData, { headers: this.getHeaders() });
  }

  updateTeamMatchNumber(teamMatchId: number, matchNumber: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/team_match/${teamMatchId}/match_number`, { matchNumber }, { headers: this.getHeaders() });
  }

  deleteTeamMatch(teamMatchId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/team_match/${teamMatchId}`, { headers: this.getHeaders() });
  }

  getTeamMatchResults(teamMatchId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team_match/${teamMatchId}/result`, { headers: this.getHeaders() });
  }

  deleteSingleMatch(matchId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/match/${matchId}`, { headers: this.getHeaders() });
  }

  getPlayerMatches(playerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/player/${playerId}/matches`, { headers: this.getHeaders() });
  }
}
