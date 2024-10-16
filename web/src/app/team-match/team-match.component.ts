import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Player } from '../models/player';
import { GameScore } from '../models/game_score';

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
  teamPlayers: Player[][] = [[], []];
  singleMatches: any[] = []; // New property to store single matches
  singleMatchData: any = {
    teamMatchId: 0,
    matchNumber: 0,
    matchType: '',
    teams: [
      { id: null, players: [new Player(), new Player()], scores: [new GameScore(), new GameScore(), new GameScore()] },
      { id: null, players: [new Player(), new Player()], scores: [new GameScore(), new GameScore(), new GameScore()] }
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
      this.loadSingleMatches(); // New method to load single matches
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
        this.loadSingleMatches(); // Reload single matches after creating a new one
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
        { id: this.teams[0].team.id, players: [new Player(), new Player()], scores: [0, 0, 0] },
        { id: this.teams[1].team.id, players: [new Player(), new Player()], scores: [0, 0, 0] }
      ]
    };
  }

  goBack(): void {
    this.location.back();
  }

  updateScore(teamIndex: number, scoreIndex: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    this.singleMatchData.teams[teamIndex].scores[scoreIndex].gameNumber = scoreIndex;
    this.singleMatchData.teams[teamIndex].scores[scoreIndex].teamScore = newValue ? parseInt(newValue, 10) : 0;
    console.log("teamIndex", teamIndex, "scoreIndex", scoreIndex, "value", this.singleMatchData.teams[teamIndex]);
  }

  loadSingleMatches(): void {
    this.tournamentService.getTeamMatchResults(this.teamMatchId).subscribe(
      (data: any[]) => {
        this.singleMatches = data;
        console.log('Single matches loaded:', this.singleMatches);
      },
      (error) => {
        console.error('Error fetching single matches:', error);
      }
    );
  }
}
