import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    loading = signal(false);
    error = signal<string | null>(null);

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    async loginWithGoogle(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            await this.authService.loginWithGoogle();
        } catch (err: any) {
            this.error.set(err.message || 'Failed to sign up with Google');
        } finally {
            this.loading.set(false);
        }
    }
}
