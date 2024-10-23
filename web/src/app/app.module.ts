import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
import { TeamStandingsComponent } from './team-standings/team-standings.component';
import { TournamentGroupsComponent } from './tournament-groups/tournament-groups.component';
import { SingleGroupComponent } from './single-group/single-group.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchManagementComponent } from './match-management/match-management.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditTeamMatchDialogComponent } from './edit-team-match-dialog/edit-team-match-dialog.component';
import { UpcomingMatchesComponent } from './upcoming-matches/upcoming-matches.component';
import { EditSingleMatchDialogComponent } from './edit-single-match-dialog/edit-single-match-dialog.component';

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
    LoginComponent,
    TeamStandingsComponent,
    TournamentGroupsComponent,
    SingleGroupComponent,
    PlayerEditComponent,
    PlayerListComponent,
    MatchManagementComponent,
    AdminPanelComponent,
    DashboardComponent,
    EditTeamMatchDialogComponent,
    UpcomingMatchesComponent,
    EditSingleMatchDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
