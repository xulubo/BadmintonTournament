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

interface MatchGroupTeam {
  matchGroupTeamId: number;
  team: Team;
  teamCode: string;
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
  associatedTeams: MatchGroupTeam[] = [];
  newSubGroup: MatchGroup = {
    groupName: '',
    tournamentId: 0,
    orderNumber: 1,
    parentMatchGroupId: 0
  };
  selectedTeamId: number | null = null;
  teamMatches: any[] = [];
  resultMatrix: any[][] = [];
  resultMatrixWithIds: any[][] = [];
  standings: any[] = [];

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
      this.loadTeamMatches();
      this.loadGroupStandings();
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
        console.log('Teams loaded:', this.teams);
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  loadAssociatedTeams(): void {
    this.tournamentService.getGroupTeams(this.groupId).subscribe(
      (data: MatchGroupTeam[]) => {
        this.associatedTeams = data;

        console.log('Associated teams loaded:', this.associatedTeams);
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

  loadTeamMatches(): void {
    this.tournamentService.getGroupTeamMatches(this.groupId).subscribe(
      (data: any[]) => {
        console.log('Team matches loaded:', data);
        this.teamMatches = data;
        this.initializeResultMatrix();
        this.updateResultMatrix();
      },
      (error) => {
        console.error('Error fetching team matches:', error);
      }
    );
  }

  initializeResultMatrix(): void {
    this.resultMatrix = this.associatedTeams.map(team => 
      this.associatedTeams.map(opponent => 
        team.team.id === opponent.team.id ? '-' : ''
      )
    );
    this.resultMatrixWithIds = this.associatedTeams.map(team => 
      this.associatedTeams.map(opponent => 
        team.team.id === opponent.team.id ? null : null
      )
    );
  }

  updateResultMatrix(): void {
    this.teamMatches.forEach(match => {
      const team1Index = this.associatedTeams.findIndex(t => t.team.id === match.teams[0].team.id);
      const team2Index = this.associatedTeams.findIndex(t => t.team.id === match.teams[1].team.id);
      
      if (team1Index !== -1 && team2Index !== -1) {
        const team1Wins = match.teams[0].totalWins || 0;
        const team2Wins = match.teams[1].totalWins || 0;
        
        this.resultMatrix[team1Index][team2Index] = `${team1Wins}:${team2Wins}`;
        this.resultMatrix[team2Index][team1Index] = `${team2Wins}:${team1Wins}`;
        
        this.resultMatrixWithIds[team1Index][team2Index] = match.id;
        this.resultMatrixWithIds[team2Index][team1Index] = match.id;
      }
    });
  }

  navigateToTeamMatch(matchId: number | null, result: string): void {
    if (matchId !== null && result !== '-' && result !== '') {
      this.router.navigate(['/team-match', matchId]);
    }
  }

  loadGroupStandings(): void {
    this.tournamentService.getGroupStandings(this.groupId).subscribe(
      (data: any[]) => {
        this.standings = data;
        console.log('Group standings loaded:', this.standings);
      },
      (error) => {
        console.error('Error fetching group standings:', error);
      }
    );
  }
}
