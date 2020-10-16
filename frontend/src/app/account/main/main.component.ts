import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  navigationTabs: NavigationTab[] = [
    {
      name: 'Overview',
      routerLink: '/account',
      isActive: false
    },
    {
      name: 'Change Profile Picture',
      routerLink: '/account/change-profile-picture',
      isActive: false
    },
    {
      name: 'Change Password',
      routerLink: '/account/change-password',
      isActive: false
    },
    {
      name: 'Change Name',
      routerLink: '/account/change-name',
      isActive: false
    },
    {
      name: 'Download Personal Data',
      routerLink: '/account/download-personal-data',
      isActive: false
    },
    {
      name: 'Delete Account',
      routerLink: '/account/delete-account',
      isActive: false
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setActiveTab();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.setActiveTab());
  }

  setActiveTab(): void {
    const activeTabBasedOnRoute = this.navigationTabs.find((tab) => tab.routerLink === this.router.url);

    this.navigationTabs.forEach((tab) => tab.isActive = false);

    if (activeTabBasedOnRoute) {
      activeTabBasedOnRoute.isActive = true;
    } else {
      this.navigationTabs[0].isActive = true;
    }
  }

}

interface NavigationTab {
  name: string;
  routerLink: string;
  isActive: boolean;
}