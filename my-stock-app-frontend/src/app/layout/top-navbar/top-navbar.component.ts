import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css'
})
export class TopNavbarComponent {
  mobileMenuCollapsed = true;

  toggleMobileMenu() {
    this.mobileMenuCollapsed = !this.mobileMenuCollapsed;
  }
}
