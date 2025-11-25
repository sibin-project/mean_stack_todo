import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './task-card.component.html',
    styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
    @Input() task!: Task;
    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    onEdit(): void {
        this.edit.emit();
    }

    onDelete(): void {
        if (confirm('Are you sure you want to delete this task?')) {
            this.delete.emit();
        }
    }

    formatDate(date?: string): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    isOverdue(date?: string): boolean {
        if (!date) return false;
        return new Date(date) < new Date() && this.task.status !== 'done';
    }
}
