import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
    @Input() task: Task | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    taskForm: FormGroup;
    loading = signal(false);
    error = signal<string | null>(null);

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService
    ) {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(200)]],
            description: ['', [Validators.maxLength(1000)]],
            status: ['todo', Validators.required],
            priority: ['medium', Validators.required],
            dueDate: ['']
        });
    }

    ngOnInit(): void {
        if (this.task) {
            // Edit mode - populate form
            this.taskForm.patchValue({
                title: this.task.title,
                description: this.task.description || '',
                status: this.task.status,
                priority: this.task.priority,
                dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : ''
            });
        }
    }

    formatDateForInput(date: string): string {
        return new Date(date).toISOString().split('T')[0];
    }

    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.taskForm.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        const formData = { ...this.taskForm.value };

        // Remove empty dueDate
        if (!formData.dueDate) {
            delete formData.dueDate;
        }

        const request = this.task
            ? this.taskService.updateTask(this.task._id, formData)
            : this.taskService.createTask(formData);

        request.subscribe({
            next: () => {
                this.loading.set(false);
                this.saved.emit();
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Failed to save task');
            }
        });
    }

    onClose(): void {
        this.close.emit();
    }

    get title() {
        return this.taskForm.get('title');
    }

    get description() {
        return this.taskForm.get('description');
    }
}
