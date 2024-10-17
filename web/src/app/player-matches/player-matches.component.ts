import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-player-matches',
  templateUrl: './player-matches.component.html',
  styleUrls: ['./player-matches.component.css']
})
export class PlayerMatchesComponent implements OnInit {
  playerId: number = 0;
  playerName: string = '';
  playerMatches: any[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerId = +params['id'];
      this.loadPlayerMatches();
    });
  }

  loadPlayerMatches(): void {
    this.isLoading = true;
    console.log('Loading matches for player:', this.playerId);
    this.tournamentService.getPlayerMatches(this.playerId).subscribe(
      (data: any) => {
        console.log('Player matches data received:', data);
        this.playerName = data.player.name || 'Unknown Player';
        this.playerMatches = data.matches || [];
        console.log('Processed player matches:', this.playerMatches);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching player matches:', error);
        this.isLoading = false;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
