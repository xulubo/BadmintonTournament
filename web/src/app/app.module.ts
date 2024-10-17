import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TournamentComponent } from './tournament/tournament.component';
import { TeamComponent } from './team/team.component';
import { PlayerComponent } from './player/player.component';
import { SingleTournamentComponent } from './single-tournament/single-tournament.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamMatchComponent } from './team-match/team-match.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { PlayerMatchesComponent } from './player-matches/player-matches.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TournamentComponent,
    TeamComponent,
    PlayerComponent,
    SingleTournamentComponent,
    TeamDetailsComponent,
    TeamMatchComponent,
    AutoFocusDirective,
    PlayerMatchesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
