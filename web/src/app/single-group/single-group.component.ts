import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

interface MatchGroup {
  matchGroupId?: number;
  groupName: string;
  tournamentId: number;
  orderNumber: number;
  parentMatchGroupId?: number;
}

interface Team {
  id: number;
  name: string;
}

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.css']
})
export class SingleGroupComponent implements OnInit {
  tournamentId: number = 0;
  groupId: number = 0;
  group: MatchGroup | null = null;
  subGroups: MatchGroup[] = [];
  teams: Team[] = [];
  associatedTeams: Team[] = [];
  newSubGroup: MatchGroup = {
    groupName: '',
    tournamentId: 0,
    orderNumber: 1,
    parentMatchGroupId: 0
  };
  selectedTeamId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tournamentId = +params['tournamentId'];
      this.groupId = +params['groupId'];
      this.loadGroupDetails();
      this.loadSubGroups();
      this.loadTeams();
      this.loadAssociatedTeams();
    });
  }

  loadGroupDetails(): void {
    this.tournamentService.getGroupDetails(this.groupId).subscribe(
      (data: MatchGroup) => {
        this.group = data;
        this.newSubGroup.tournamentId = this.tournamentId;
        this.newSubGroup.parentMatchGroupId = this.groupId;
      },
      (error) => {
        console.error('Error fetching group details:', error);
      }
    );
  }

  loadSubGroups(): void {
    this.tournamentService.getSubGroups(this.groupId).subscribe(
      (data: MatchGroup[]) => {
        this.subGroups = data;
        this.newSubGroup.orderNumber = this.subGroups.length + 1;
      },
      (error) => {
        console.error('Error fetching sub-groups:', error);
      }
    );
  }

  loadTeams(): void {
    this.tournamentService.getTournamentTeams(this.tournamentId).subscribe(
      (data: Team[]) => {
        this.teams = data;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  loadAssociatedTeams(): void {
    this.tournamentService.getGroupTeams(this.groupId).subscribe(
      (data: Team[]) => {
        this.associatedTeams = data;
      },
      (error) => {
        console.error('Error fetching associated teams:', error);
      }
    );
  }

  addSubGroup(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.addMatchGroup(this.newSubGroup).subscribe(
      (response: MatchGroup) => {
        console.log('Sub-group added successfully:', response);
        this.subGroups.push(response);
        this.resetNewSubGroup();
        this.loadSubGroups(); // Reload sub-groups to get updated list
      },
      (error) => {
        console.error('Error adding sub-group:', error);
      }
    );
  }

  associateTeam(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    if (this.selectedTeamId !== null) {
      this.tournamentService.associateTeamToGroup(this.groupId, this.selectedTeamId).subscribe(
        () => {
          console.log('Team associated successfully');
          this.loadAssociatedTeams();
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

  resetNewSubGroup(): void {
    this.newSubGroup = {
      groupName: '',
      tournamentId: this.tournamentId,
      orderNumber: this.subGroups.length + 1,
      parentMatchGroupId: this.groupId
    };
  }

  navigateToSubGroup(subGroupId: number | undefined): void {
    if (subGroupId !== undefined) {
      this.router.navigate(['/tournament', this.tournamentId, 'group', subGroupId]);
    } else {
      console.error('Sub-group ID is undefined');
    }
  }
}
