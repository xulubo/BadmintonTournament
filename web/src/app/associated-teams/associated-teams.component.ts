import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-associated-teams',
  templateUrl: './associated-teams.component.html'
})
export class AssociatedTeamsComponent implements OnInit {
  groupId: number = 0;
  tournamentId: number = 0;
  associatedTeams: any[] = [];
  availableTeams: any[] = [];
  selectedTeamId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
        this.groupId = +params['groupId'];
        console.log('Group ID:', this.groupId);
        this.loadAssociatedTeams();
      });
  

    // Traverse up the route tree to find the tournament ID
    let currentRoute = this.route;
    while (currentRoute.parent) {
      const tournamentId = currentRoute.snapshot.paramMap.get('id');
      if (tournamentId) {
        this.tournamentId = +tournamentId;
        console.log('Tournament ID:', this.tournamentId);
        break;
      }
      currentRoute = currentRoute.parent;
    }

    if (this.tournamentId === 0) {
      console.error('Tournament ID is missing');
    }
  }

  loadAssociatedTeams(): void {
    console.log('Loading associated teams for group ID:', this.groupId);
    this.tournamentService.getGroupTeams(this.groupId).subscribe(
      (data: any[]) => {
        this.associatedTeams = data;
        console.log('Associated teams loaded:', this.associatedTeams);
      },
      (error) => {
        console.error('Error fetching associated teams:', error);
      }
    );
  }

  loadAvailableTeams(): void {
    console.log('Loading available teams for group ID:', this.groupId);
    this.tournamentService.getAvailableTeamsForGroup(this.groupId).subscribe(
      (data: any[]) => {
        this.availableTeams = data;
        console.log('Available teams loaded:', this.availableTeams);
      },
      (error) => {
        console.error('Error fetching available teams:', error);
      }
    );
  }

  associateTeam(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    if (this.selectedTeamId !== null) {
      console.log(`Associating team ${this.selectedTeamId} to group ${this.groupId}`);
      this.tournamentService.associateTeamToGroup(this.groupId, this.selectedTeamId).subscribe(
        () => {
          console.log('Team associated successfully');
          this.loadAssociatedTeams();
          this.loadAvailableTeams();
          this.selectedTeamId = null;  // Reset selection after association
        },
        (error) => {
          console.error('Error associating team:', error);
        }
      );
    } else {
      console.error('No team selected');
    }
  }
}
