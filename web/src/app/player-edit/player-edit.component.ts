import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.css']
})
export class PlayerEditComponent implements OnInit {
  playerId: number = 0;
  player: any = {
    firstName: '',
    lastName: '',
    displayName: '',
    gender: '',
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerId = +params['id'];
      this.loadPlayerDetails();
    });
  }

  loadPlayerDetails(): void {
    this.tournamentService.getPlayerDetails(this.playerId).subscribe(
      (data: any) => {
        this.player = data;
        if (!this.player.displayName) {
          this.player.displayName = `${this.player.firstName} ${this.player.lastName}`;
        }
      },
      (error) => {
        console.error('Error fetching player details:', error);
      }
    );
  }

  updatePlayer(): void {
    if (!this.authService.isAdmin()) {
      alert('You do not have permission to perform this action.');
      return;
    }
    this.tournamentService.updatePlayer(this.playerId, this.player).subscribe(
      (response) => {
        console.log('Player updated successfully:', response);
        this.router.navigate(['/team', this.player.teamId]);
      },
      (error) => {
        console.error('Error updating player:', error);
      }
    );
  }
}
