import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

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
  resultMatrixWithIds: any[][] = []; // New property to store match IDs
  standings: any[] = []; // New property for team standings

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.tournamentId = +id;
      this.matchResult.tournamentId = this.tournamentId;
      this.loadTeamMatches();
      this.loadStandings(); // New method call
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

    this.tournamentService.getTournamentTeams(this.tournamentId).subscribe(
      (data: any[]) => {
        this.teams = data;
      },
      (error) => {
        console.error('Error fetching tournament teams:', error);
      }
    );
    var matchTeams = Array.from(teamsSet).map(team => JSON.parse(team as string));
    // Create uniqueTeams array with no duplicate names
    this.uniqueTeams = Array.from(new Set(matchTeams.map(t => t.name)))
      .map(name => matchTeams.find(t => t.name === name));
    console.log('Extracted matchTeams:', matchTeams);
    console.log('Unique matchTeams:', this.uniqueTeams);
  }

  initializeResultMatrix(): void {
    this.resultMatrix = this.uniqueTeams.map(team => 
      this.uniqueTeams.map(opponent => 
        team.id === opponent.id ? '-' : '0:0'
      )
    );
    this.resultMatrixWithIds = this.uniqueTeams.map(team => 
      this.uniqueTeams.map(opponent => 
        team.id === opponent.id ? null : null
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
        
        if (team1Wins !== 0 || team2Wins !== 0) {
          this.resultMatrix[team1Index][team2Index] = `${team1Wins}:${team2Wins}`;
          this.resultMatrix[team2Index][team1Index] = `${team2Wins}:${team1Wins}`;
        } else {
          this.resultMatrix[team1Index][team2Index] = '';
          this.resultMatrix[team2Index][team1Index] = '';
        }
        
        this.resultMatrixWithIds[team1Index][team2Index] = match.id;
        this.resultMatrixWithIds[team2Index][team1Index] = match.id;
      }
    });
    console.log('Updated result matrix:', this.resultMatrix);
    console.log('Updated result matrix with IDs:', this.resultMatrixWithIds);
  }

  createMatch(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
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
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
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

  navigateToTeamMatch(matchId: number | null, result: string): void {
    if (matchId !== null && result !== '-' && result !== '0:0') {
      this.router.navigate(['/team-match', matchId]);
    }
  }

  loadStandings(): void {
    this.tournamentService.getTournamentStandings(this.tournamentId).subscribe(
      (data: any[]) => {
        this.standings = data;
        console.log('Standings loaded:', this.standings);
      },
      (error) => {
        console.error('Error fetching standings:', error);
      }
    );
  }
}
