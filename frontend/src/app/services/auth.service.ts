import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User as FirebaseUser, idToken } from '@angular/fire/auth';
import { User } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;

    // Signals
    currentUser = signal<User | null>(null);
    loading = signal<boolean>(true);

    // Firebase user observable
    user$ = user(this.auth);

    constructor() {
        // Initialize from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
            this.loading.set(false);
        }

        // Sync Firebase user state with local signal and backend
        this.user$.pipe(
            distinctUntilChanged((prev, curr) => prev?.uid === curr?.uid),
            switchMap(firebaseUser => {
                if (firebaseUser) {
                    return from(firebaseUser.getIdToken()).pipe(
                        switchMap(token => this.verifyTokenBackend(token))
                    );
                } else {
                    return of(null);
                }
            })
        ).subscribe({
            next: (user) => {
                this.currentUser.set(user);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    localStorage.removeItem('user');
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Auth state sync error:', err);
                this.currentUser.set(null);
                localStorage.removeItem('user');
                this.loading.set(false);
            }
        });
    }

    // Sign in with Google
    async loginWithGoogle(): Promise<void> {
        try {
            const provider = new GoogleAuthProvider();
            const credential = await signInWithPopup(this.auth, provider);
            const token = await credential.user.getIdToken();

            // Verify with backend and create/update user
            this.verifyTokenBackend(token).subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUser.set(user);
                        this.router.navigate(['/dashboard']);
                    }
                },
                error: (error) => {
                    console.error('Backend verification failed:', error);
                }
            });
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    // Verify Firebase token with backend
    private verifyTokenBackend(token: string): Observable<User | null> {
        return this.http.post<{ success: boolean, token?: string, user: User }>(`${this.apiUrl}/google-login`, { token }, { withCredentials: true }).pipe(
            map(response => {
                if (response.success && response.token) {
                    localStorage.setItem('auth_token', response.token);
                    return response.user;
                }
                return null;
            }),
            catchError(err => {
                console.error('Token verification error:', err);
                if (err.status === 401 || err.status === 403) {
                    this.logout();
                }
                return of(null);
            })
        );
    }

    // Logout
    async logout(): Promise<void> {
        await signOut(this.auth);
        this.currentUser.set(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
    }

    // Helper to check if logged in
    isLoggedIn(): boolean {
        return !!this.currentUser();
    }
}
