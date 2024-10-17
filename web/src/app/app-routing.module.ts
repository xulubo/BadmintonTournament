import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentComponent } from './tournament/tournament.component';
import { TeamComponent } from './team/team.component';
import { PlayerComponent } from './player/player.component';
import { SingleTournamentComponent } from './single-tournament/single-tournament.component';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamMatchComponent } from './team-match/team-match.component';
import { PlayerMatchesComponent } from './player-matches/player-matches.component';
import { LoginComponent } from './login/login.component';
import { TeamStandingsComponent } from './team-standings/team-standings.component';

const routes: Routes = [
  { path: '', redirectTo: '/tournament', pathMatch: 'full' },
  { path: 'tournament', component: TournamentComponent },
  { path: 'tournament/:id', component: SingleTournamentComponent },
  { path: 'tournament/:id/standings', component: TeamStandingsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'team/:id', component: TeamDetailsComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'team-match/:id', component: TeamMatchComponent },
  { path: 'player-matches/:id', component: PlayerMatchesComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
