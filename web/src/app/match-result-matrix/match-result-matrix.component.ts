import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-match-result-matrix',
  templateUrl: './match-result-matrix.component.html'
})
export class MatchResultMatrixComponent implements OnInit {
  groupId: number = 0;
  associatedTeams: any[] = [];
  resultMatrix: any[][] = [];
  resultMatrixWithIds: any[][] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.groupId = +params['groupId'];
      this.loadAssociatedTeams();
    });
  }

  loadAssociatedTeams(): void {
    this.tournamentService.getGroupTeams(this.groupId).subscribe(
      (data: any[]) => {
        this.associatedTeams = data;
        this.initializeResultMatrix();
        this.loadTeamMatches();
      },
      (error) => {
        console.error('Error fetching associated teams:', error);
      }
    );
  }

  initializeResultMatrix(): void {
    this.resultMatrix = this.associatedTeams.map(team => 
      this.associatedTeams.map(opponent => 
        team.team.id === opponent.team.id ? '-' : ''
      )
    );
    this.resultMatrixWithIds = this.associatedTeams.map(team => 
      this.associatedTeams.map(opponent => 
        team.team.id === opponent.team.id ? null : null
      )
    );
  }

  loadTeamMatches(): void {
    this.tournamentService.getGroupTeamMatches(this.groupId).subscribe(
      (data: any[]) => {
        this.updateResultMatrix(data);
      },
      (error) => {
        console.error('Error fetching team matches:', error);
      }
    );
  }

  updateResultMatrix(teamMatches: any[]): void {
    teamMatches.forEach(match => {
      const team1Index = this.associatedTeams.findIndex(t => t.team.id === match.teams[0].team.id);
      const team2Index = this.associatedTeams.findIndex(t => t.team.id === match.teams[1].team.id);
      
      if (team1Index !== -1 && team2Index !== -1) {
        const team1Wins = match.teams[0].totalWins || 0;
        const team2Wins = match.teams[1].totalWins || 0;
        
        this.resultMatrix[team1Index][team2Index] = `${team1Wins}:${team2Wins}`;
        this.resultMatrix[team2Index][team1Index] = `${team2Wins}:${team1Wins}`;
        
        this.resultMatrixWithIds[team1Index][team2Index] = match.id;
        this.resultMatrixWithIds[team2Index][team1Index] = match.id;
      }
    });
  }

  navigateToTeamMatch(matchId: number): void {
    // Implement navigation logic here
  }

  isResultMatrixReady(): boolean {
    return this.resultMatrix.length > 0 && this.associatedTeams.length > 0;
  }
}
