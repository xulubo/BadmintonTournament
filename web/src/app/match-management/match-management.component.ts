import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../services/tournament.service';

@Component({
  selector: 'app-match-management',
  templateUrl: './match-management.component.html',
  styleUrls: ['./match-management.component.css']
})
export class MatchManagementComponent implements OnInit {
  // Add properties as needed

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    // Initialize component
  }

  // Add methods as needed
}
