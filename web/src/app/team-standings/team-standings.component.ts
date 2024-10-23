import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-team-standings',
  templateUrl: './team-standings.component.html',
  styleUrls: ['./team-standings.component.css']
})
export class TeamStandingsComponent implements OnInit {
  tournamentId: number = 0;
  standings: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.tournamentId = +id;
        this.loadStandings();
      } else {
        console.error('Tournament ID is missing');
      }
    });
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
