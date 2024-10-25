import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { TournamentService } from '../services/tournament.service';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        if (label === 'Tournament Details') {
          const tournamentId = child.snapshot.params['id'];
          breadcrumbs.push({label: 'Tournament', url: '/tournaments'});
          this.tournamentService.getTournamentDetails(tournamentId).subscribe(
            (tournament: any) => {
              const tournamentIndex = breadcrumbs.findIndex(b => b.label === 'Tournament');
              if (tournamentIndex !== -1) {
                breadcrumbs.splice(tournamentIndex + 1, 0, { label: tournament.name, url });
              }
            }
          );
        } else if (label === 'Group Details') {
          const groupId = child.snapshot.params['groupId'];
          this.tournamentService.getGroupDetails(groupId).subscribe(
            (group: any) => {
                const tournamentIndex = breadcrumbs.findIndex(b => b.label === 'Groups');
                breadcrumbs.splice(tournamentIndex + 1, 0, { label: group.groupName, url });
            }
          );
        } else {
          breadcrumbs.push({label, url});
        }
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
