import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ongoingTournaments: any[] = [];
  recentMatches: any[] = [];

  constructor(
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadOngoingTournaments();
    this.loadRecentMatches();
  }

  loadOngoingTournaments(): void {
    this.tournamentService.getTournaments().subscribe(
      (data: any[]) => {
        const currentDate = new Date();
        this.ongoingTournaments = data.filter(tournament => {
          const startDate = new Date(tournament.startDate);
          const endDate = new Date(tournament.endDate);
          return startDate <= currentDate && currentDate <= endDate;
        });
      },
      (error) => {
        console.error('Error fetching tournaments:', error);
      }
    );
  }

  loadRecentMatches(): void {
    // As there's no getRecentMatches method, we'll need to implement this
    // or remove it if it's not needed. For now, let's leave it empty.
    console.log('loadRecentMatches method needs to be implemented');
  }
}
