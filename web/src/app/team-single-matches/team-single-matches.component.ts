import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { MatDialog } from '@angular/material/dialog';
import { EditSingleMatchDialogComponent } from '../edit-single-match-dialog/edit-single-match-dialog.component';

@Component({
  selector: 'app-team-single-matches',
  templateUrl: './team-single-matches.component.html'
})
export class TeamSingleMatchesComponent implements OnInit {
  teamId: number = 0;
  teamName: string = '';
  teamMatches: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.pathFromRoot.forEach(route => {
      if (route.snapshot.paramMap.has('id')) {
        this.teamId = +route.snapshot.paramMap.get('id')!;
        console.log('Team ID:', this.teamId);
        this.loadTeamDetails();
        this.loadTeamSingleMatches();
      }
    });

    if (this.teamId === 0) {
      console.error('Team ID is missing');
    }
  }

  loadTeamDetails(): void {
    console.log('Loading team details for ID:', this.teamId);
    this.tournamentService.getTeamDetails(this.teamId).subscribe(
      (data: any) => {
        this.teamName = data.name;
        console.log('Team name:', this.teamName);
      },
      (error) => {
        console.error('Error fetching team details:', error);
      }
    );
  }

  loadTeamSingleMatches(): void {
    console.log('Loading single matches for team ID:', this.teamId);
    this.tournamentService.getTeamSingleMatches(this.teamId).subscribe(
      (data: any[]) => {
        this.teamMatches = data;
        console.log('Team single matches loaded:', this.teamMatches);
      },
      (error) => {
        console.error('Error fetching team single matches:', error);
      }
    );
  }

  editSingleMatch(match: any): void {
    const dialogRef = this.dialog.open(EditSingleMatchDialogComponent, {
      width: '400px',
      data: { ...match }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSingleMatch(result);
      }
    });
  }

  updateSingleMatch(updatedMatch: any): void {
    this.tournamentService.updateSingleMatch(updatedMatch).subscribe(
      (response) => {
        console.log('Single match updated successfully:', response);
        this.loadTeamSingleMatches();
      },
      (error) => {
        console.error('Error updating single match:', error);
      }
    );
  }

  deleteSingleMatch(matchId: number): void {
    this.tournamentService.deleteSingleMatch(matchId).subscribe(
      () => {
        console.log('Single match deleted successfully');
        this.loadTeamSingleMatches();
      },
      (error) => {
        console.error('Error deleting single match:', error);
      }
    );
  }
} 