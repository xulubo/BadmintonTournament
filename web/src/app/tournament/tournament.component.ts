import { Component, OnInit } from '@angular/core';
import { Tournament } from '../models/tournament';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  tournaments: Tournament[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.tournamentService.getTournaments()
      .subscribe(
        (data: Tournament[]) => {
          this.tournaments = data;
        },
        (error) => {
          console.error('Error fetching tournaments:', error);
        }
      );
  }
}
