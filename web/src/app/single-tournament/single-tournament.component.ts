import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-single-tournament',
  templateUrl: './single-tournament.component.html',
  styleUrls: ['./single-tournament.component.css']
})
export class SingleTournamentComponent implements OnInit {
  tournamentId: number = 0;
  teams: any[] = [];
  matchNumber: number = 1;
  teamPlayers: any[][] = [[], []];
  matchTypes: string[] = ['XD', 'MD', 'WD'];
  matchData: any = {
    tournamentId: 0,
    matchNumber: 1,
    matchType: '',
    teams: [
      { id: null, players: [null, null], gameScores: [0, 0, 0] },
      { id: null, players: [null, null], gameScores: [0, 0, 0] }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.tournamentId = +id;
      this.matchData.tournamentId = this.tournamentId;
      this.loadTeams();
    } else {
      console.error('Tournament ID is missing');
    }
  }

  loadTeams(): void {
    this.tournamentService.getTournamentTeams(this.tournamentId)
      .subscribe(
        (data: any[]) => {
          this.teams = data;
        },
        (error) => {
          console.error('Error fetching teams:', error);
        }
      );
  }

  onTeamSelect(teamIndex: number): void {
    const teamId = this.matchData.teams[teamIndex].id;
    if (teamId) {
      this.tournamentService.getTeamPlayers(teamId)
        .subscribe(
          (players: any[]) => {
            this.teamPlayers[teamIndex] = players;
          },
          (error) => {
            console.error(`Error fetching players for team ${teamIndex + 1}:`, error);
          }
        );
    }
  }

  createMatch(): void {
    this.tournamentService.createTeamMatch(this.tournamentId, this.matchData)
      .subscribe(
        (response) => {
          console.log('Team match created successfully:', response);
          this.resetForm();
        },
        (error) => {
          console.error('Error creating team match:', error);
        }
      );
  }

  resetForm(): void {
    this.matchData = {
      tournamentId: this.tournamentId,
      matchNumber: this.matchData.matchNumber + 1,
      matchType: '',
      teams: [
        { id: null, players: [null, null], gameScores: [0, 0, 0] },
        { id: null, players: [null, null], gameScores: [0, 0, 0] }
      ]
    };
    this.teamPlayers = [[], []];
  }
}
