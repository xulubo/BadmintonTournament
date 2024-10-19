import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TournamentComponent } from './tournament/tournament.component';
import { TeamComponent } from './team/team.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchManagementComponent } from './match-management/match-management.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { SingleTournamentComponent } from './single-tournament/single-tournament.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamMatchComponent } from './team-match/team-match.component';
import { PlayerMatchesComponent } from './player-matches/player-matches.component';
import { LoginComponent } from './login/login.component';
import { TeamStandingsComponent } from './team-standings/team-standings.component';
import { TournamentGroupsComponent } from './tournament-groups/tournament-groups.component';
import { SingleGroupComponent } from './single-group/single-group.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tournaments', component: TournamentComponent },
  { path: 'teams', component: TeamComponent },
  { path: 'players', component: PlayerListComponent },
  { path: 'matches', component: MatchManagementComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tournament', component: TournamentComponent },
  { path: 'tournament/:id', component: SingleTournamentComponent },
  { path: 'tournament/:id/standings', component: TeamStandingsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'team/:id', component: TeamDetailsComponent },
  { path: 'team-match/:id', component: TeamMatchComponent },
  { path: 'player-matches/:id', component: PlayerMatchesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tournament/:id/groups', component: TournamentGroupsComponent },
  { path: 'tournament/:tournamentId/group/:groupId', component: SingleGroupComponent },
  { path: 'player/:id/edit', component: PlayerEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
