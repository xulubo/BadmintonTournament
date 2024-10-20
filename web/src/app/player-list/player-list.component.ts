import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  tournamentId: number = 0;
  players: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadPlayers();
    });
  }

  loadPlayers(): void {
    this.tournamentService.getTournamentPlayers(this.tournamentId).subscribe(
      (data: any[]) => {
        this.players = data;
        console.log('Players loaded:', this.players);
      },
      (error) => {
        console.error('Error fetching players:', error);
      }
    );
  }
}
