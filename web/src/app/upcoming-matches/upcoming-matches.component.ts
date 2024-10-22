import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { TeamMatch } from '../models/team-match.model';
import { MatDialog } from '@angular/material/dialog';
import { EditTeamMatchDialogComponent } from '../edit-team-match-dialog/edit-team-match-dialog.component';

@Component({
  selector: 'app-upcoming-matches',
  templateUrl: './upcoming-matches.component.html'
})
export class UpcomingMatchesComponent implements OnInit {
  tournamentId: number = 0;
  upcomingMatches: TeamMatch[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadUpcomingMatches();
    });
  }

  loadUpcomingMatches(): void {
    this.tournamentService.getUpcomingTournamentMatches(this.tournamentId).subscribe(
      (data: TeamMatch[]) => {
        this.upcomingMatches = data.map((match, index) => ({
          ...match,
          matchNumber: match.matchNumber || index + 1 // Assign a number if not provided
        }));
        console.log('Upcoming matches loaded:', this.upcomingMatches);
      },
      (error) => {
        console.error('Error fetching upcoming matches:', error);
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
        this.loadUpcomingMatches(); // Reload matches to reflect changes
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
        this.loadUpcomingMatches(); // Reload matches to reflect changes
      },
      (error) => {
        console.error('Error deleting match:', error);
      }
    );
  }

  navigateToTeamMatch(matchId: number): void {
    this.router.navigate(['/team-match', matchId]);
  }
}
