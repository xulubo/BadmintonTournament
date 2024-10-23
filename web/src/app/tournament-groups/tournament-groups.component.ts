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

@Component({
  selector: 'app-tournament-groups',
  templateUrl: './tournament-groups.component.html',
  styleUrls: ['./tournament-groups.component.css']
})
export class TournamentGroupsComponent implements OnInit {
  tournamentId: number = 0;
  tournamentName: string = '';
  matchGroups: MatchGroup[] = [];
  newGroup: MatchGroup = {
    groupName: '',
    tournamentId: 0,
    orderNumber: 1,
    parentMatchGroupId: undefined
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    // Use the parent route's params to get the tournament ID
    this.route.parent?.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.tournamentId = +id;
        this.newGroup.tournamentId = this.tournamentId;
        this.loadTournamentDetails();
        this.loadMatchGroups();
      } else {
        console.error('Tournament ID is missing');
      }
    });
  }

  loadTournamentDetails(): void {
    this.tournamentService.getTournamentDetails(this.tournamentId).subscribe(
      (data: any) => {
        this.tournamentName = data.name;
      },
      (error) => {
        console.error('Error fetching tournament details:', error);
      }
    );
  }

  loadMatchGroups(): void {
    this.tournamentService.getMatchGroups(this.tournamentId).subscribe(
      (data: MatchGroup[]) => {
        this.matchGroups = data;
      },
      (error) => {
        console.error('Error fetching match groups:', error);
      }
    );
  }

  addGroup(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.addMatchGroup(this.newGroup).subscribe(
      (response: MatchGroup) => {
        console.log('Group added successfully:', response);
        this.matchGroups.push(response);
        this.resetNewGroup();
      },
      (error) => {
        console.error('Error adding group:', error);
      }
    );
  }

  resetNewGroup(): void {
    this.newGroup = {
      groupName: '',
      tournamentId: this.tournamentId,
      orderNumber: this.matchGroups.length + 1,
      parentMatchGroupId: undefined
    };
  }

  navigateToSingleGroup(groupId: number | undefined): void {
    if (groupId !== undefined) {
      this.router.navigate(['/tournament', this.tournamentId, 'group', groupId]);
    } else {
      console.error('Group ID is undefined');
    }
  }
}
