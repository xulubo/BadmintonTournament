import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  teamId: number = 0;
  teamName: string = '';
  players: any[] = [];
  newPlayerName: string = '';

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.teamId = +id;
      this.loadTeamDetails();
      this.loadPlayers();
    } else {
      console.error('Team ID is missing');
    }
  }

  loadTeamDetails(): void {
    this.tournamentService.getTeamDetails(this.teamId)
      .subscribe(
        (data: any) => {
          this.teamName = data.name;
        },
        (error) => {
          console.error('Error fetching team details:', error);
        }
      );
  }

  loadPlayers(): void {
    this.tournamentService.getTeamPlayers(this.teamId)
      .subscribe(
        (data: any[]) => {
          this.players = data;
        },
        (error) => {
          console.error('Error fetching players:', error);
        }
      );
  }

  addPlayer(): void {
    if (this.newPlayerName.trim()) {
      this.tournamentService.addPlayer(this.newPlayerName, this.teamId)
        .subscribe(
          (response) => {
            console.log('Player added successfully:', response);
            this.newPlayerName = ''; // Clear the input field
            this.loadPlayers(); // Reload the player list
          },
          (error) => {
            console.error('Error adding player:', error);
          }
        );
    }
  }
}
