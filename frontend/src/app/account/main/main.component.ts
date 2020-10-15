import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  navigationTabs: NavigationTab[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.navigationTabs.push(
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
    );
    this.setActiveTabOnPageLoad();
  }

  setActiveTabOnPageLoad(): void {
    const activeTabBasedOnRoute = this.navigationTabs.find((tab) => tab.routerLink === this.router.url);

    if (activeTabBasedOnRoute) {
      activeTabBasedOnRoute.isActive = true;
    } else {
      this.navigationTabs[0].isActive = true;
    }
  }

  onTabClick(clickedIndex: number) {
    this.navigationTabs.find((tab) => tab.isActive).isActive = false;
    this.navigationTabs[clickedIndex].isActive = true;
  }

}

interface NavigationTab {
  name: string;
  routerLink: string;
  isActive: boolean;
}