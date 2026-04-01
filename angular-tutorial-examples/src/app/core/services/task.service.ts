import { Injectable, signal, computed } from '@angular/core';
import { Task, Priority } from '../models/tutorial.models';

/**
 * TaskService demonstrates Angular signals-based state management.
 * Uses computed() for derived state and effect() patterns.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<Task[]>([
    { id: 1, title: 'Learn Angular Components', completed: true, priority: 'high', createdAt: new Date('2024-01-01') },
    { id: 2, title: 'Master Angular Signals', completed: false, priority: 'high', createdAt: new Date('2024-01-02') },
    { id: 3, title: 'Explore Reactive Forms', completed: false, priority: 'medium', createdAt: new Date('2024-01-03') },
    { id: 4, title: 'Build a REST API client', completed: false, priority: 'medium', createdAt: new Date('2024-01-04') },
    { id: 5, title: 'Study Dependency Injection', completed: true, priority: 'low', createdAt: new Date('2024-01-05') },
  ]);

  private _nextId = 6;

  /** Public read-only signal */
  readonly tasks = this._tasks.asReadonly();

  /** Computed: only incomplete tasks */
  readonly pendingTasks = computed(() =>
    this._tasks().filter(t => !t.completed)
  );

  /** Computed: only completed tasks */
  readonly completedTasks = computed(() =>
    this._tasks().filter(t => t.completed)
  );

  /** Computed: counts by priority */
  readonly taskStats = computed(() => {
    const all = this._tasks();
    return {
      total: all.length,
      completed: all.filter(t => t.completed).length,
      pending: all.filter(t => !t.completed).length,
      high: all.filter(t => t.priority === 'high').length,
      medium: all.filter(t => t.priority === 'medium').length,
      low: all.filter(t => t.priority === 'low').length,
    };
  });

  /** Computed: completion percentage */
  readonly completionPercentage = computed(() => {
    const stats = this.taskStats();
    return stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
  });

  addTask(title: string, priority: Priority = 'medium'): void {
    const newTask: Task = {
      id: this._nextId++,
      title,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    this._tasks.update(tasks => [...tasks, newTask]);
  }

  toggleTask(id: number): void {
    this._tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  removeTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  updatePriority(id: number, priority: Priority): void {
    this._tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, priority } : t)
    );
  }
}
