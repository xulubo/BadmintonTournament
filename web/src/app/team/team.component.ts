import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

interface Team {
  id: number;
  name: string;
  order: number;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  tournamentId: number = 0;
  teams: Team[] = [];
  newTeam: Team = { id: 0, name: '', order: 0 };
  editingTeam: Team | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      (data: Team[]) => {
        this.teams = data.sort((a, b) => a.order - b.order);
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
    this.newTeam.order = this.teams.length + 1;
    this.tournamentService.addTeamToTournament(this.tournamentId, this.newTeam).subscribe(
      (response: Team) => {
        console.log('Team added successfully:', response);
        this.teams.push(response);
        this.teams.sort((a, b) => a.order - b.order);
        this.newTeam = { id: 0, name: '', order: 0 };
      },
      (error) => {
        console.error('Error adding team:', error);
      }
    );
  }

  startEditing(team: Team): void {
    if (this.authService.isAdmin()) {
      this.editingTeam = { ...team };
    }
  }

  saveTeam(): void {
    if (!this.authService.isAdmin() || !this.editingTeam) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.updateTeam(this.editingTeam.id, this.editingTeam).subscribe(
      (response: Team) => {
        console.log('Team updated successfully:', response);
        const index = this.teams.findIndex(t => t.id === this.editingTeam!.id);
        if (index !== -1) {
          this.teams[index] = response;
        }
        this.teams.sort((a, b) => a.order - b.order);
        this.editingTeam = null;
      },
      (error) => {
        console.error('Error updating team:', error);
      }
    );
  }

  cancelEditing(): void {
    this.editingTeam = null;
  }

  viewTeamPlayers(teamId: number): void {
    this.router.navigate(['/team', teamId]);
  }
}
