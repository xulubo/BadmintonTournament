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

  createMatch(): void {
    this.tournamentService.createTeamMatch(this.tournamentId, this.matchData)
      .subscribe(
        (response) => {
          console.log('Team match created successfully:', response);
          this.successMessage = 'Team match created successfully!';
          this.resetForm();
          // Optionally, you can navigate to a different page or update the current page
          // this.router.navigate(['/tournament', this.tournamentId]);
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
