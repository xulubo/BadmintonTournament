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
  teamMatches: any[] = [];
  matchTypes: string[] = ['XD', 'MD', 'WD'];
  matchData: any = {
    tournamentId: 0,
    matchNumber: 1,
    matchType: '',
    teamIds: [null, null]
  };
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.tournamentId = +id;
      this.matchData.tournamentId = this.tournamentId;
      this.loadTeams();
      this.loadTeamMatches();
    } else {
      console.error('Tournament ID is missing');
    }
  }

  loadTeams(): void {
    this.tournamentService.getTournamentTeams(this.tournamentId)
      .subscribe(
        (data: any[]) => {
          this.teams = data;
          console.log('Teams loaded:', this.teams);
        },
        (error) => {
          console.error('Error fetching teams:', error);
        }
      );
  }

  loadTeamMatches(): void {
    console.log('Loading team matches for tournament:', this.tournamentId);
    this.tournamentService.getTournamentTeamMatches(this.tournamentId)
      .subscribe(
        (data: any[]) => {
          console.log('Team matches data received:', data);
          this.teamMatches = data;
          console.log('Team matches loaded:', this.teamMatches);
        },
        (error) => {
          console.error('Error fetching team matches:', error);
        }
      );
  }

  createMatch(): void {
    this.tournamentService.createTeamMatch(this.tournamentId, this.matchData)
      .subscribe(
        (response) => {
          console.log('Team match created successfully:', response);
          this.successMessage = 'Team match created successfully!';
          this.resetForm();
          this.loadTeamMatches(); // Reload the team matches after creating a new one
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
      teamIds: [null, null]
    };
  }
}
