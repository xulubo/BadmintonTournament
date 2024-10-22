import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  tournamentId: number = 0;
  teams: any[] = [];
  newTeam: any = { name: '' };

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    public authService: AuthService
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

  addTeam(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.addTeamToTournament(this.tournamentId, this.newTeam).subscribe(
      (response) => {
        console.log('Team added successfully:', response);
        this.teams.push(response);
        this.newTeam = { name: '' };
      },
      (error) => {
        console.error('Error adding team:', error);
      }
    );
  }
}
