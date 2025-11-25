import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

export const firebaseConfig = {

    apiKey: "AIzaSyDbVz-TwV1crTnhSDfG95PxygmX3jNpR5o",
    authDomain: "taskmaster-x.firebaseapp.com",
    projectId: "taskmaster-x",
    storageBucket: "taskmaster-x.firebasestorage.app",
    messagingSenderId: "144850345806",
    appId: "1:144850345806:web:8545205c9895c0652ec81f"
};

export const firebaseProviders = [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
];
