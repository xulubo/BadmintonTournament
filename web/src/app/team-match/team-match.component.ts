import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-team-match',
  templateUrl: './team-match.component.html',
  styleUrls: ['./team-match.component.css']
})
export class TeamMatchComponent implements OnInit {
  teamMatchId: number = 0;
  matchNumber: number = 0;
  matchTypes: string[] = ['XD', 'WD', 'MD'];
  teams: any[] = [];
  teamNames: string[] = ['', ''];
  teamPlayers: any[][] = [[], []];
  singleMatchData: any = {
    teamMatchId: 0,
    matchNumber: 0,
    matchType: '',
    teams: [
      { id: null, players: [null, null], scores: [0, 0, 0] },
      { id: null, players: [null, null], scores: [0, 0, 0] }
    ]
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
        this.matchNumber = data.matchNumber;
        this.singleMatchData.teams[0].id = this.teams[0].team.id;
        this.singleMatchData.teams[1].id = this.teams[1].team.id;
        this.teamNames[0] = this.teams[0].team.name;
        this.teamNames[1] = this.teams[1].team.name;
        this.loadTeamPlayers();
      },
      (error) => {
        console.error('Error fetching team match details:', error);
      }
    );
  }

  loadTeamPlayers(): void {
    const team1Request = this.tournamentService.getTeamDetails(this.singleMatchData.teams[0].id);
    const team2Request = this.tournamentService.getTeamDetails(this.singleMatchData.teams[1].id);

    forkJoin([team1Request, team2Request]).subscribe(
      ([team1Data, team2Data]) => {
        this.teamPlayers[0] = team1Data.players;
        this.teamPlayers[1] = team2Data.players;
      },
      (error) => {
        console.error('Error fetching team players:', error);
      }
    );
  }

  updateMatchNumber(): void {
    this.tournamentService.updateTeamMatchNumber(this.teamMatchId, this.matchNumber).subscribe(
      (response) => {
        console.log('Match number updated successfully:', response);
      },
      (error) => {
        console.error('Error updating match number:', error);
      }
    );
  }

  createSingleMatch(): void {
    this.singleMatchData.teamMatchId = this.teamMatchId;
    this.singleMatchData.matchNumber = this.matchNumber;
    this.tournamentService.createSingleMatch(this.teamMatchId, this.singleMatchData).subscribe(
      (response) => {
        console.log('Single match created successfully:', response);
        this.resetForm();
      },
      (error) => {
        console.error('Error creating single match:', error);
      }
    );
  }

  resetForm(): void {
    this.singleMatchData = {
      teamMatchId: this.teamMatchId,
      matchNumber: this.matchNumber,
      matchType: '',
      teams: [
        { id: this.teams[0].team.id, players: [null, null], scores: [0, 0, 0] },
        { id: this.teams[1].team.id, players: [null, null], scores: [0, 0, 0] }
      ]
    };
  }

  goBack(): void {
    this.location.back();
  }
}