import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament';
import { tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TeamMatch } from '../models/team-match.model';

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

private logRequest(method: string, endpoint: string): void {
    console.log(`${method} ${this.apiUrl}${endpoint}`);
  }

  getTournaments(): Observable<Tournament[]> {
    this.logRequest('GET', '/tournament');
    return this.http.get<Tournament[]>(`${this.apiUrl}/tournament`, { headers: this.getHeaders() });
  }

  getTournamentTeams(tournamentId: number): Observable<any[]> {
    this.logRequest('GET', `/tournament/${tournamentId}/team`);
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/team`, { headers: this.getHeaders() });
  }

  getTeamDetails(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team/${teamId}`, { headers: this.getHeaders() });
  }

  getTeamPlayers(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/team/${teamId}/player`, { headers: this.getHeaders() });
  }

  addPlayer(playerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/player`, playerData, { headers: this.getHeaders() });
  }

  deletePlayer(playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/player/${playerId}`, { headers: this.getHeaders() });
  }

  createTeamMatch(matchData: any): Observable<any> {
    this.logRequest('POST', '/team_match');
    console.log("matchData", matchData)
    return this.http.post(`${this.apiUrl}/team_match`, matchData, { headers: this.getHeaders() });
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

  deleteTeamMatch(matchId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/team_match/${matchId}`, { headers: this.getHeaders() });
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

  getTournamentStandings(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/standing`, { headers: this.getHeaders() });
  }

  getTournamentDetails(tournamentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tournament/${tournamentId}`, { headers: this.getHeaders() });
  }

  getMatchGroups(tournamentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/match-groups`, { headers: this.getHeaders() });
  }

  addMatchGroup(matchGroup: any): Observable<any> {
    console.log("matchGroup", matchGroup);
    return this.http.post(`${this.apiUrl}/match-group`, matchGroup, { headers: this.getHeaders() });
  }

  getGroupDetails(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/match-group/${groupId}`, { headers: this.getHeaders() });
  }

  getSubGroups(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/match-group/${groupId}/sub-groups`, { headers: this.getHeaders() });
  }

  getGroupTeams(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/match-group/${groupId}/teams`, { headers: this.getHeaders() });
  }

  associateTeamToGroup(groupId: number, teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/match-group/${groupId}/team/${teamId}`, {}, { headers: this.getHeaders() });
  }

  getGroupTeamMatches(groupId: number): Observable<any[]> {
    this.logRequest('GET', `/match-group/${groupId}/team_match`);
    return this.http.get<any[]>(`${this.apiUrl}/match-group/${groupId}/team_match`, { headers: this.getHeaders() });
  }

  getGroupStandings(matchGroupId: number): Observable<any[]> {
    this.logRequest('GET', `/match-group/${matchGroupId}/standing`);
    return this.http.get<any[]>(`${this.apiUrl}/match-group/${matchGroupId}/standing`, { headers: this.getHeaders() });
  }

  getPlayerDetails(playerId: number): Observable<any> {
    this.logRequest('GET', `/player/${playerId}`);
    return this.http.get<any>(`${this.apiUrl}/player/${playerId}`, { headers: this.getHeaders() });
  }

  updatePlayer(playerId: number, playerData: any): Observable<any> {
    this.logRequest('PUT', `/player/${playerId}`);
    console.log("playerData", playerData)
    return this.http.put<any>(`${this.apiUrl}/player/${playerId}`, playerData, { headers: this.getHeaders() });
  }

  getAllPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players`, { headers: this.getHeaders() });
  }

  getTournamentPlayers(tournamentId: number): Observable<any[]> {
    this.logRequest('GET', `/tournament/${tournamentId}/players`);
    return this.http.get<any[]>(`${this.apiUrl}/tournament/${tournamentId}/players`, { headers: this.getHeaders() });
  }

  updateTeamMatch(match: TeamMatch): Observable<TeamMatch> {
    console.log("update team match", match)
    return this.http.put<TeamMatch>(`${this.apiUrl}/team_match/${match.id}`, match);
  }

  getUpcomingTournamentMatches(tournamentId: number): Observable<TeamMatch[]> {
    this.logRequest('GET', `/tournament/${tournamentId}/upcoming-matches`);
    return this.http.get<TeamMatch[]>(`${this.apiUrl}/tournament/${tournamentId}/upcoming-matches`, { headers: this.getHeaders() });
  }

  addTeamToTournament(tournamentId: number, teamData: any): Observable<any> {
    console.log("teamData", teamData)
    return this.http.post(`${this.apiUrl}/tournament/${tournamentId}/team`, teamData, { headers: this.getHeaders() });
  }

  updateTeam(teamId: number, teamData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/team/${teamId}`, teamData, { headers: this.getHeaders() });
  }
}
