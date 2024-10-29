import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-single-match-list',
  templateUrl: './single-match-list.component.html',
  styleUrls: ['./single-match-list.component.css']
})
export class SingleMatchListComponent implements OnChanges
{
  @Input() singleMatches: any[] = [];
  @Input() teamNames: string[] = [];
  @Output() editMatch = new EventEmitter<any>();
  @Output() deleteMatch = new EventEmitter<number>();

  constructor(private router: Router, public authService: AuthService) {}
    
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['singleMatches']) {
        this.onSingleMatchesSet();
      }
  }



  private onSingleMatchesSet(): void {
    this.singleMatches.forEach(teamMatch => {
        teamMatch.teamMatchTeams[0].totalWins = 0;
        teamMatch.teamMatchTeams[1].totalWins = 0;
        for(let i = 0; i < teamMatch.teamMatchTeams[0].scores.length; i++) {
            if(teamMatch.teamMatchTeams[0].scores[i].teamScore > teamMatch.teamMatchTeams[1].scores[i].teamScore) {
                teamMatch.teamMatchTeams[0].totalWins++;
            }
            else if(teamMatch.teamMatchTeams[0].scores[i].teamScore < teamMatch.teamMatchTeams[1].scores[i].teamScore) {
                teamMatch.teamMatchTeams[1].totalWins++;
            }
        }
    });
    // Logic to execute after singleMatches is set
    console.log('singleMatches has been updated:', this.singleMatches);
  }

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