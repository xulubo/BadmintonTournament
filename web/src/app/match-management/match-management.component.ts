import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

interface TeamMatch {
  id: number;
  matchNumber?: number;
  teams: {
    team: {
      id: number;
      name: string;
    };
    totalWins: number;
  }[];
}

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
    public authService: AuthService
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
        this.teamMatches = data.map(match => ({
          ...match,
          teams: match.teams.map(team => ({
            ...team,
            //team: team.team || { id: 0, name: 'Unknown' }
          }))
        }));
        console.log('Team matches loaded:', this.teamMatches);
      },
      (error) => {
        console.error('Error fetching team matches:', error);
      }
    );
  }

  navigateToTeamMatch(matchId: number): void {
    this.router.navigate(['/team-match', matchId]);
  }

  getTeamName(team: any): string {
    return team && team.team && team.team.name ? team.team.name : 'Unknown';
  }
}
