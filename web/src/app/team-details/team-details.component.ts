import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  teamId: number = 0;
  players: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.teamId = +id;
      this.loadPlayers();
    } else {
      console.error('Team ID is missing');
    }
  }

  loadPlayers(): void {
    this.tournamentService.getTeamPlayers(this.teamId)
      .subscribe(
        (data: any[]) => {
          this.players = data;
        },
        (error) => {
          console.error('Error fetching players:', error);
        }
      );
  }
}
