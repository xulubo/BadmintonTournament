import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TournamentComponent } from './tournament/tournament.component';
import { SingleTournamentComponent } from './single-tournament/single-tournament.component';
import { TeamComponent } from './team/team.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { MatchManagementComponent } from './match-management/match-management.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamMatchComponent } from './team-match/team-match.component';
import { PlayerMatchesComponent } from './player-matches/player-matches.component';
import { LoginComponent } from './login/login.component';
import { TeamStandingsComponent } from './team-standings/team-standings.component';
import { TournamentGroupsComponent } from './tournament-groups/tournament-groups.component';
import { SingleGroupComponent } from './single-group/single-group.component';
import { PlayerEditComponent } from './player-edit/player-edit.component';
import { UpcomingMatchesComponent } from './upcoming-matches/upcoming-matches.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
  { path: 'tournaments', component: TournamentComponent, data: { breadcrumb: 'Tournaments' } },
  { 
    path: 'tournament/:id', 
    component: SingleTournamentComponent,
    data: { breadcrumb: 'Tournament Details' },
    children: [
      { path: '', redirectTo: 'upcoming-matches', pathMatch: 'full' },
      { path: 'upcoming-matches', component: UpcomingMatchesComponent, data: { breadcrumb: 'Upcoming Matches' } },
      { path: 'teams', component: TeamComponent, data: { breadcrumb: 'Teams' } },
      { path: 'players', component: PlayerListComponent, data: { breadcrumb: 'Players' } },
      { path: 'standings', component: TeamStandingsComponent, data: { breadcrumb: 'Standings' } },
      { 
        path: 'group', 
        component: TournamentGroupsComponent, 
        data: { breadcrumb: 'Groups' },
        children: [
          { 
            path: ':groupId', 
            component: SingleGroupComponent,
            data: { breadcrumb: 'Group Details' },
            children: [
              {
                path: 'team-match/:matchId',
                component: TeamMatchComponent,
                data: { breadcrumb: 'Team Match Details' }
              }
            ]
          }
        ]
      },
      { path: 'matches', component: MatchManagementComponent, data: { breadcrumb: 'Matches' } },
    ]
  },
  { 
    path: 'team/:id', 
    component: TeamDetailsComponent,
    data: { breadcrumb: 'Team Details' }
  },
  { 
    path: 'player-matches/:id', 
    component: PlayerMatchesComponent,
    data: { breadcrumb: 'Player Matches' }
  },
  { 
    path: 'player/:id/edit', 
    component: PlayerEditComponent,
    data: { breadcrumb: 'Edit Player' }
  },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    canActivate: [AuthGuard, AdminGuard],
    data: { breadcrumb: 'Admin Panel' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
