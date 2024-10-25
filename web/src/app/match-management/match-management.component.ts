import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';
import { TeamMatch } from '../models/team-match.model';
import { MatDialog } from '@angular/material/dialog';
import { EditTeamMatchDialogComponent } from '../edit-team-match-dialog/edit-team-match-dialog.component';

@Component({
  selector: 'app-match-management',
  templateUrl: './match-management.component.html',
  styleUrls: ['./match-management.component.css']
})
export class MatchManagementComponent implements OnInit {
  tournamentId: number = 0;
  teamMatches: TeamMatch[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadTeamMatches();
    });
  }

  loadTeamMatches(): void {
    this.tournamentService.getTournamentTeamMatches(this.tournamentId).subscribe(
      (data: TeamMatch[]) => {
        this.teamMatches = data;
        console.log('Team matches loaded:', this.teamMatches);
      },
      (error) => {
        console.error('Error fetching team matches:', error);
      }
    );
  }

  openEditMatchDialog(match: TeamMatch): void {
    const dialogRef = this.dialog.open(EditTeamMatchDialogComponent, {
      width: '400px',
      data: { ...match }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          this.deleteTeamMatch(result.id);
        } else {
          this.updateTeamMatch(result);
        }
      }
    });
  }

  updateTeamMatch(updatedMatch: TeamMatch): void {
    this.tournamentService.updateTeamMatch(updatedMatch).subscribe(
      (response) => {
        console.log('Match updated successfully:', response);
        this.loadTeamMatches();
      },
      (error) => {
        console.error('Error updating match:', error);
      }
    );
  }

  deleteTeamMatch(matchId: number): void {
    this.tournamentService.deleteTeamMatch(matchId).subscribe(
      () => {
        console.log('Match deleted successfully');
        this.loadTeamMatches();
      },
      (error) => {
        console.error('Error deleting match:', error);
      }
    );
  }

  navigateToTeamMatch(matchId: number): void {
    this.router.navigate(['..','team-match', matchId], { relativeTo: this.route });
  }

  viewTeamPlayers(teamId: number): void {
    this.router.navigate(['/team', teamId]);
  }
}
