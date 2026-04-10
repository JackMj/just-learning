import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  input,
  model,
  untracked,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';

/* ─────────────────────────────────────────────────────────
   Example 3 - Computed Signals Demo Component
   ───────────────────────────────────────────────────────── */
@Component({
  selector: 'app-cart-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart-demo.component.html',
  styleUrl: './cart-demo.component.scss',
  imports: [DecimalPipe],
})
export class CartDemoComponent {
  private _items = signal([
    { id: 1, name: 'Angular Course', price: 49.99, qty: 1 },
    { id: 2, name: 'RxJS Mastery', price: 39.99, qty: 2 },
    { id: 3, name: 'TypeScript Pro', price: 29.99, qty: 1 },
  ]);

  readonly items = this._items.asReadonly();

  readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.qty, 0)
  );
  readonly tax = computed(() => this.subtotal() * 0.08);
  readonly total = computed(() => this.subtotal() + this.tax());
  readonly itemCount = computed(() => this.items().reduce((s, i) => s + i.qty, 0));

  increment(id: number): void {
    this._items.update(items => items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }

  decrement(id: number): void {
    this._items.update(items =>
      items.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)
    );
  }
}

/* ─────────────────────────────────────────────────────────
   Example 4 - effect() Demo
   ───────────────────────────────────────────────────────── */
@Component({
  selector: 'app-effect-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './effect-demo.component.html',
  styleUrl: './effect-demo.component.scss',
})
export class EffectDemoComponent implements OnInit {
  readonly theme = signal<'dark' | 'light' | 'ocean'>('dark');
  readonly fontSize = signal(16);
  readonly effectLog = signal<string[]>([]);

  ngOnInit(): void {
    effect(() => {
      const t = this.theme();
      const fs = this.fontSize();
      // effect tracks all signals read inside
      untracked(() => {
        this.effectLog.update(log => [
          ...log.slice(-9),
          `[${new Date().toLocaleTimeString()}] theme="${t}", fontSize=${fs}`,
        ]);
      });
    });
  }
}

/* ─────────────────────────────────────────────────────────
   Example 5 - model() signal (two-way)
   ───────────────────────────────────────────────────────── */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  /** model() creates a two-way bindable signal */
  readonly value = model<number>(0);
  readonly hovered = signal(0);
  readonly stars = [1, 2, 3, 4, 5];
}

/* ─────────────────────────────────────────────────────────
   Main Signals Topic Page
   ───────────────────────────────────────────────────────── */
@Component({
  selector: 'app-signals-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CartDemoComponent, EffectDemoComponent, StarRatingComponent, CodeSnippetComponent],
  templateUrl: './signals-topic.component.html',
  styleUrl: './signals-topic.component.scss',
})
export class SignalsTopicComponent {
  readonly taskSvc: TaskService;

  constructor() {
    this.taskSvc = new TaskService();
  }

  /* Ex 1 */
  readonly counterSignal = signal(0);
  readonly statusSignal = signal<'online' | 'offline'>('offline');

  /* Ex 5 */
  readonly parentRating = signal(0);

  /* Ex 6 */
  readonly inputDemoName = signal('Jane Doe');
  readonly inputDemoRole = signal<'admin' | 'editor' | 'viewer'>('editor');
  readonly roles: Array<'admin' | 'editor' | 'viewer'> = ['admin', 'editor', 'viewer'];

  /* Code snippets */
  readonly codeSignal1 = `// Create a signal
const count = signal(0);

// Read (call as function)
console.log(count()); // 0

// Replace with set()
count.set(5);

// Derive from current value with update()
count.update(n => n + 1);

// Typed signal
const status = signal<'online' | 'offline'>('offline');

// Read-only exposure from a service
class MyService {
  private _count = signal(0);
  readonly count = this._count.asReadonly(); // consumers can't mutate
}`;

  readonly codeSignal2 = `// In the service (TaskService):
private readonly _tasks = signal<Task[]>([]);
readonly tasks = this._tasks.asReadonly();     // exposed as read-only
readonly pendingTasks = computed(() =>
  this._tasks().filter(t => !t.completed)
);
readonly completionPercentage = computed(() => /* ... */);

// Mutation methods — controlled writes
addTask(title: string): void {
  this._tasks.update(tasks => [...tasks, newTask]);
}

// In the component:
readonly taskSvc = inject(TaskService);
readonly tasks = this.taskSvc.tasks;   // reactive reference`;

  readonly codeSignal3 = `// computed() creates a LAZY, memoized derived signal
// It only re-evaluates when its dependencies change

const items = signal([{ price: 10, qty: 2 }, { price: 20, qty: 1 }]);

const subtotal = computed(() =>
  items().reduce((sum, i) => sum + i.price * i.qty, 0)
);

const tax = computed(() => subtotal() * 0.08);   // depends on subtotal
const total = computed(() => subtotal() + tax()); // dependency chain

// computed() is READ-ONLY — you cannot .set() on it`;

  readonly codeSignal4 = `// effect() runs whenever tracked signals change
// Must be called in an injection context (constructor or with injector)

effect(() => {
  const theme = this.theme();       // tracked dependency
  const size = this.fontSize();     // tracked dependency
  document.body.style.fontSize = size + 'px';

  // Use untracked() to read without creating dependency
  untracked(() => {
    this.analytics.track('theme-changed', { theme });
  });
});

// Cleanup inside effect
effect((onCleanup) => {
  const sub = interval(1000).subscribe(...);
  onCleanup(() => sub.unsubscribe()); // runs before next execution
});`;

  readonly codeSignal5 = `// model() creates a two-way bindable signal — child declares it
export class StarRatingComponent {
  readonly value = model<number>(0); // emits valueChange when set
}

// Parent template — two-way binding syntax
<app-star-rating [(value)]="myRating" />

// Equivalent longhand:
<app-star-rating
  [value]="myRating()"
  (valueChange)="myRating.set($event)"
/>

// model() vs input(): model() emits valueChange; input() doesn't`;

  readonly codeSignal6 = `// Signal-based inputs (Angular 17.1+) — preferred over @Input()
export class UserBadgeComponent {
  // Required input — TypeScript error if not provided
  readonly name = input.required<string>();

  // Optional with default value
  readonly role = input<UserRole>('viewer');

  // With transform function (e.g. coerce string to number)
  readonly age = input(0, { transform: (v: string) => +v });

  // Computed from input — re-derives when input changes
  readonly initials = computed(() =>
    this.name().split(' ').map(n => n[0]).join('').toUpperCase()
  );
}

// Unlike @Input, input() signals are read-only inside the component`;
}
