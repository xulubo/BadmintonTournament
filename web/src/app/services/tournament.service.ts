import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament';

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
}
