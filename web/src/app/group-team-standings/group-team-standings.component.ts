import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-group-team-standings',
  templateUrl: './group-team-standings.component.html'
})
export class GroupTeamStandingsComponent implements OnInit {
  groupId: number = 0;
  standings: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.groupId = +params['groupId'];
      this.loadGroupStandings();
    });
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
