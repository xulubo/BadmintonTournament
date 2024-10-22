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
  player: any = {};

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
      (response: any) => {
        console.log('Player updated successfully:', response);
        // Navigate back to the player list or details page
        if (this.player.teamId) {
          this.router.navigate(['/team', this.player.teamId]);
        } else {
          // If teamId is not available, navigate to a default route
          this.router.navigate(['/tournaments']);
        }
      },
      (error) => {
        console.error('Error updating player:', error);
      }
    );
  }
}
