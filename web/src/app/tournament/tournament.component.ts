import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  tournaments: any[] = [];
  newTournament: any = {
    name: '',
    location: '',
    startDate: '',
    endDate: ''
  };

  constructor(
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.tournamentService.getTournaments().subscribe(
      (data: any[]) => {
        this.tournaments = data;
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
      }
    );
  }

  createTournament(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.createTournament(this.newTournament).subscribe(
      (response) => {
        console.log('Tournament created successfully:', response);
        this.tournaments.push(response);
        this.resetNewTournament();
      },
      (error) => {
        console.error('Error creating tournament:', error);
      }
    );
  }

  resetNewTournament(): void {
    this.newTournament = {
      name: '',
      location: '',
      startDate: '',
      endDate: ''
    };
  }

  navigateToTournament(tournamentId: number): void {
    this.router.navigate(['/tournament', tournamentId]);
  }
}
