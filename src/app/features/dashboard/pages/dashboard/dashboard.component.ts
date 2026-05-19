import { Component, OnInit, ViewChild } from '@angular/core';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { NavComponent } from '../../../../shared/components/nav/nav.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideNavComponent, NavComponent, MatSidenavModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSmallScreen = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;

        if (this.isSmallScreen) {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
        } else {
          this.sidenavMode = 'side';
          this.sidenavOpened = true;
        }
      });
  }

  onToggleSidenav(): void {
    this.sidenav.toggle();
  }

  onNavItemClicked() {
   if (this.sidenavMode === 'over') {
    this.sidenav.close();
  }
  }
}
