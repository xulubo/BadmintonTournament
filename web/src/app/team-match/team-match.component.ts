import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {
  teamMatchId: number = 0;
  matchTypes: string[] = ['XD', 'WD', 'MD'];
  teams: any[] = [];
  teamNames: string[] = ['', '']; // Add this line to store team names
  singleMatchData: any = {
    matchType: '',
    team1: { id: null, player1: null, player2: null, scores: [0, 0, 0] },
    team2: { id: null, player1: null, player2: null, scores: [0, 0, 0] }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.teamMatchId = +id;
      this.loadTeamMatchDetails();
    } else {
      console.error('Team Match ID is missing');
    }
  }

  loadTeamMatchDetails(): void {
    this.tournamentService.getTeamMatchDetails(this.teamMatchId).subscribe(
      (data: any) => {
        this.teams = data.teams;
        this.singleMatchData.team1.id = this.teams[0].id;
        this.singleMatchData.team2.id = this.teams[1].id;
        this.teamNames[0] = this.teams[0].team.name; // Store team1 name
        this.teamNames[1] = this.teams[1].team.name; // Store team2 name
      },
      (error) => {
        console.error('Error fetching team match details:', error);
      }
    );
  }

  createSingleMatch(): void {
    this.tournamentService.createSingleMatch(this.teamMatchId, this.singleMatchData).subscribe(
      (response) => {
        console.log('Single match created successfully:', response);
        // Reset form or update UI as needed
        this.resetForm();
      },
      (error) => {
        console.error('Error creating single match:', error);
      }
    );
  }

  resetForm(): void {
    this.singleMatchData = {
      matchType: '',
      team1: { id: this.teams[0].id, player1: null, player2: null, scores: [0, 0, 0] },
      team2: { id: this.teams[1].id, player1: null, player2: null, scores: [0, 0, 0] }
    };
  }

  goBack(): void {
    this.location.back();
  }
}
