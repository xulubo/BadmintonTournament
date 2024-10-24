import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-team-match-list',
  templateUrl: './team-match-list.component.html'
})
export class TeamMatchListComponent implements OnInit {
  groupId: number = 0;
  teamMatches: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.groupId = +params['groupId'];
      this.loadTeamMatches();
    });
  }

  loadTeamMatches(): void {
    this.tournamentService.getGroupTeamMatches(this.groupId).subscribe(
      (data: any[]) => {
        this.teamMatches = data;
        console.log('Team matches loaded:', this.teamMatches);
      },
      (error) => {
        console.error('Error fetching team matches:', error);
      }
    );
  }

  navigateToTeamMatch(matchId: number): void {
    this.router.navigate(['team-match', matchId], { relativeTo: this.route });
  }
}
