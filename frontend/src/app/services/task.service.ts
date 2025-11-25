import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskResponse, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    getTasks(filters?: {
        status?: string;
        priority?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Observable<TaskResponse> {
        let params = new HttpParams();

        if (filters) {
            if (filters.status) params = params.set('status', filters.status);
            if (filters.priority) params = params.set('priority', filters.priority);
            if (filters.search) params = params.set('search', filters.search);
            if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
            if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
        }

        return this.http.get<TaskResponse>(this.apiUrl, {
            params,
            withCredentials: true
        });
    }

    createTask(data: CreateTaskRequest): Observable<TaskResponse> {
        return this.http.post<TaskResponse>(this.apiUrl, data, {
            withCredentials: true
        });
    }

    updateTask(id: string, data: UpdateTaskRequest): Observable<TaskResponse> {
        return this.http.put<TaskResponse>(`${this.apiUrl}/${id}`, data, {
            withCredentials: true
        });
    }

    deleteTask(id: string): Observable<TaskResponse> {
        return this.http.delete<TaskResponse>(`${this.apiUrl}/${id}`, {
            withCredentials: true
        });
    }
}
