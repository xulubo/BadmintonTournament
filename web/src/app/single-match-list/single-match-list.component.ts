import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-match-list',
  templateUrl: './single-match-list.component.html'
})
export class SingleMatchListComponent {
  @Input() singleMatches: any[] = [];
  @Input() teamNames: string[] = [];
  @Output() editMatch = new EventEmitter<any>();
  @Output() deleteMatch = new EventEmitter<number>();

  constructor(private router: Router) {}

  onEditMatch(match: any): void {
    this.editMatch.emit(match);
  }

  onDeleteMatch(matchId: number): void {
    this.deleteMatch.emit(matchId);
  }

  navigateToPlayerMatches(playerId: number): void {
    this.router.navigate(['/player-matches', playerId]);
  }
} 