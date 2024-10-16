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

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.tournamentId = +id;
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
}
