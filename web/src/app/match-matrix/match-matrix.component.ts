import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeamMatch } from '../models/team-match.model';

@Component({
  selector: 'app-match-matrix',
  templateUrl: './match-matrix.component.html'
})
export class MatchMatrixComponent {
  @Input() matches: TeamMatch[] = [];
  @Output() editMatch = new EventEmitter<TeamMatch>();
  @Output() viewDetails = new EventEmitter<number>();
  @Output() viewTeamPlayers = new EventEmitter<number>();

  onEditMatch(match: TeamMatch): void {
    this.editMatch.emit(match);
  }

  onViewDetails(matchId: number): void {
    this.viewDetails.emit(matchId);
  }

  onViewTeamPlayers(teamId: number): void {
    this.viewTeamPlayers.emit(teamId);
  }
}
