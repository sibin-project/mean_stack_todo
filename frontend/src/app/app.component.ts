import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'MEAN Todo App';
}
