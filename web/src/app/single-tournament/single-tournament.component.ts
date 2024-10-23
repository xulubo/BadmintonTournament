import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../services/tournament.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-single-tournament',
  templateUrl: './single-tournament.component.html',
  styleUrls: ['./single-tournament.component.css']
})
export class SingleTournamentComponent implements OnInit {
  tournamentId: number = 0;
  tournamentName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tournamentId = +params['id'];
      this.loadTournamentDetails();
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
}
