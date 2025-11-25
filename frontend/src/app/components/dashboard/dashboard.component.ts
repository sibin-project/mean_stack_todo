import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, TaskCardComponent, TaskFormComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    tasks = signal<Task[]>([]);
    loading = signal(true);
    showTaskForm = signal(false);
    editingTask = signal<Task | null>(null);

    // Filters
    searchQuery = signal('');
    statusFilter = signal<string>('all');
    priorityFilter = signal<string>('all');
    sortBy = signal<string>('createdAt');
    sortOrder = signal<'asc' | 'desc'>('desc');

    // Computed filtered tasks
    filteredTasks = computed(() => {
        let result = this.tasks();

        // Apply search
        const search = this.searchQuery().toLowerCase();
        if (search) {
            result = result.filter(task =>
                task.title.toLowerCase().includes(search) ||
                task.description?.toLowerCase().includes(search)
            );
        }

        // Apply status filter
        if (this.statusFilter() !== 'all') {
            result = result.filter(task => task.status === this.statusFilter());
        }

        // Apply priority filter
        if (this.priorityFilter() !== 'all') {
            result = result.filter(task => task.priority === this.priorityFilter());
        }

        // Apply sorting
        result.sort((a, b) => {
            const sortField = this.sortBy();
            let aVal: any = a[sortField as keyof Task];
            let bVal: any = b[sortField as keyof Task];

            if (sortField === 'createdAt' || sortField === 'dueDate') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (this.sortOrder() === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    });

    // Task counts
    taskCounts = computed(() => ({
        total: this.tasks().length,
        todo: this.tasks().filter(t => t.status === 'todo').length,
        inProgress: this.tasks().filter(t => t.status === 'in-progress').length,
        done: this.tasks().filter(t => t.status === 'done').length
    }));

    constructor(
        private taskService: TaskService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.loading.set(true);
        this.taskService.getTasks().subscribe({
            next: (response) => {
                if (response.success && response.tasks) {
                    this.tasks.set(response.tasks);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading tasks:', err);
                this.loading.set(false);
            }
        });
    }

    openTaskForm(task?: Task): void {
        this.editingTask.set(task || null);
        this.showTaskForm.set(true);
    }

    closeTaskForm(): void {
        this.showTaskForm.set(false);
        this.editingTask.set(null);
    }

    onTaskSaved(): void {
        this.closeTaskForm();
        this.loadTasks();
    }

    onTaskDeleted(taskId: string): void {
        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                this.loadTasks();
            },
            error: (err) => {
                console.error('Error deleting task:', err);
            }
        });
    }

    clearFilters(): void {
        this.searchQuery.set('');
        this.statusFilter.set('all');
        this.priorityFilter.set('all');
    }
}
