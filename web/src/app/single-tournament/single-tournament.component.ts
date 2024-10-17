import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-single-tournament',
  templateUrl: './single-tournament.component.html',
  styleUrls: ['./single-tournament.component.css']
})
export class SingleTournamentComponent implements OnInit {
  tournamentId: number = 0;
  teams: any[] = [];
  uniqueTeams: any[] = []; // New property for unique teams
  teamMatches: any[] = [];
  matchTypes: string[] = ['XD', 'MD', 'WD'];
  matchResult: any = {
    tournamentId: 0,
    matchNumber: 1,
    matchType: '',
    teamIds: [null, null]
  };
  successMessage: string = '';
  resultMatrix: any[][] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.tournamentId = +id;
      this.matchResult.tournamentId = this.tournamentId;
      this.loadTeamMatches();
    } else {
      console.error('Tournament ID is missing');
    }
  }

  loadTeamMatches(): void {
    console.log('Loading team matches for tournament:', this.tournamentId);
    this.tournamentService.getTournamentTeamMatches(this.tournamentId)
      .subscribe(
        (data: any[]) => {
          console.log('Team matches data received:', data);
          this.teamMatches = data;
          this.extractTeams();
          this.initializeResultMatrix();
          this.updateResultMatrix();
          console.log('Team matches loaded:', this.teamMatches);
        },
        (error) => {
          console.error('Error fetching team matches:', error);
        }
      );
  }

  extractTeams(): void {
    const teamsSet = new Set();
    this.teamMatches.forEach(match => {
      match.teams.forEach((team: any) => {
        teamsSet.add(JSON.stringify(team));
      });
    });
    this.teams = Array.from(teamsSet).map(team => JSON.parse(team as string));
    // Create uniqueTeams array with no duplicate names
    this.uniqueTeams = Array.from(new Set(this.teams.map(t => t.name)))
      .map(name => this.teams.find(t => t.name === name));
    console.log('Extracted teams:', this.teams);
    console.log('Unique teams:', this.uniqueTeams);
  }

  initializeResultMatrix(): void {
    this.resultMatrix = this.uniqueTeams.map(team => 
      this.uniqueTeams.map(opponent => 
        team.id === opponent.id ? '-' : '0:0'
      )
    );
  }

  updateResultMatrix(): void {
    this.teamMatches.forEach(match => {
      const team1Index = this.uniqueTeams.findIndex(t => t.id === match.teams[0].id);
      const team2Index = this.uniqueTeams.findIndex(t => t.id === match.teams[1].id);
      
      if (team1Index !== -1 && team2Index !== -1) {
        const team1Wins = match.teams[0].totalWins || 0;
        const team2Wins = match.teams[1].totalWins || 0;
        
        this.resultMatrix[team1Index][team2Index] = `${team1Wins}:${team2Wins}`;
        this.resultMatrix[team2Index][team1Index] = `${team2Wins}:${team1Wins}`;
      }
    });
    console.log('Updated result matrix:', this.resultMatrix);
  }

  createMatch(): void {
    this.tournamentService.createTeamMatch(this.tournamentId, this.matchResult)
      .subscribe(
        (response) => {
          console.log('Team match created successfully:', response);
          this.successMessage = 'Team match created successfully!';
          this.resetForm();
          this.loadTeamMatches();
          // Check if response has an id before navigating
          if (response && response.id) {
            this.router.navigate(['/team-match', response.id]);
          } else {
            console.error('Created team match response does not contain an id:', response);
            // Show an error message to the user
            this.successMessage += ' However, there was an issue navigating to the new match. Please refresh the page to see the updated list.';
          }
        },
        (error) => {
          console.error('Error creating team match:', error);
          this.successMessage = 'Error creating team match. Please try again.';
        }
      );
  }

  resetForm(): void {
    this.matchResult = {
      tournamentId: this.tournamentId,
      matchNumber: this.matchResult.matchNumber + 1,
      matchType: '',
      teamIds: [null, null]
    };
  }

  deleteTeamMatch(matchId: number): void {
    if (confirm('Are you sure you want to delete this team match?')) {
      this.tournamentService.deleteTeamMatch(matchId).subscribe(
        () => {
          console.log('Team match deleted successfully');
          this.loadTeamMatches(); // Reload the team matches list
        },
        (error) => {
          console.error('Error deleting team match:', error);
        }
      );
    }
  }
}
