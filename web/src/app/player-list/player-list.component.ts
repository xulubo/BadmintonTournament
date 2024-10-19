import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {
  players: any[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.tournamentService.getAllPlayers().subscribe(
      (data: any[]) => {
        this.players = data;
      },
      (error) => {
        console.error('Error fetching players:', error);
      }
    );
  }
}
