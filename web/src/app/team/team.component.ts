import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  tournamentId: number = 0;
  teams: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadTeams();
    });
  }

  loadTeams(): void {
    this.tournamentService.getTournamentTeams(this.tournamentId).subscribe(
      (data: any[]) => {
        this.teams = data;
        console.log('Teams loaded:', this.teams);
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }
}
