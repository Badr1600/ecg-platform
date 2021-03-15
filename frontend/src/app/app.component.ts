import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { navItems } from './_nav';


@Component({
  selector: 'app-root', //selector: 'app-root',
  templateUrl: './app.component.html', //templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] //styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    public iconSet: IconSetService
    ) { 
      // iconSet singleton
      iconSet.icons = { ...freeSet };
    }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/home'])
      .then(() => {
        window.location.reload();
      });
  }
}
