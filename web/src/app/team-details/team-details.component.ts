import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  teamId: number = 0;
  teamName: string = '';
  players: any[] = [];
  newPlayer: any = {
    firstName: '',
    lastName: '',
    displayName: '',
    gender: 'M',
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    public authService: AuthService
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
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    const playerData = {
      ...this.newPlayer,
      teamId: this.teamId,
    };
    if (!playerData.displayName) {
      playerData.displayName = `${playerData.firstName} ${playerData.lastName}`;
    }
    this.tournamentService.addPlayer(playerData).subscribe(
      (response) => {
        console.log('Player added successfully:', response);
        this.players.push(response);
        this.resetNewPlayer();
      },
      (error) => {
        console.error('Error adding player:', error);
      }
    );
  }

  resetNewPlayer(): void {
    this.newPlayer = {
      firstName: '',
      lastName: '',
      displayName: '',
      gender: 'M',
      comment: ''
    };
  }

  deletePlayer(playerId: number): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.deletePlayer(playerId)
      .subscribe(
        () => {
          console.log('Player deleted successfully');
          this.loadPlayers(); // Reload the player list
        },
        (error) => {
          console.error('Error deleting player:', error);
        }
      );
  }
}
