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
  template: `
    <div class="cart-demo">
      <div class="cart-items">
        @for (item of items(); track item.id) {
          <div class="cart-item">
            <span class="item-name">{{ item.name }}</span>
            <div class="item-qty">
              <button class="qty-btn" (click)="decrement(item.id)">−</button>
              <span>{{ item.qty }}</span>
              <button class="qty-btn" (click)="increment(item.id)">+</button>
            </div>
            <span class="item-price">{{ (item.price * item.qty) | number:'1.2-2' }}</span>
          </div>
        }
      </div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal ({{ itemCount() }} items)</span>
          <strong>\${{ subtotal() | number:'1.2-2' }}</strong>
        </div>
        <div class="summary-row">
          <span>Tax (8%)</span>
          <strong>\${{ tax() | number:'1.2-2' }}</strong>
        </div>
        <div class="summary-row summary-row--total">
          <span>Total</span>
          <strong class="total-price">\${{ total() | number:'1.2-2' }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-demo { display: flex; flex-direction: column; gap: 1rem; }
    .cart-item { display: flex; align-items: center; gap: 1rem; padding: 10px 12px; background: var(--color-surface-3); border-radius: 8px; }
    .item-name { flex: 1; font-size: 0.9rem; }
    .item-qty { display: flex; align-items: center; gap: 8px; }
    .qty-btn { background: var(--color-surface); border: 1px solid var(--color-border-strong); border-radius: 6px; color: var(--color-text); cursor: pointer; width: 28px; height: 28px; font-size: 1rem; transition: all 0.15s; &:hover { border-color: var(--color-primary); color: var(--color-primary-light); } }
    .item-price { font-family: 'Fira Code', monospace; font-size: 0.85rem; width: 60px; text-align: right; }
    .cart-summary { border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-text-secondary); &--total { font-size: 1rem; color: var(--color-text); padding-top: 0.5rem; border-top: 1px solid var(--color-border); } }
    .total-price { color: var(--color-success); font-size: 1.25rem; }
  `],
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
  template: `
    <div class="effect-demo">
      <div class="form-group">
        <label>Theme</label>
        <select (change)="theme.set($any($event.target).value)">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="ocean">Ocean</option>
        </select>
      </div>
      <div class="form-group">
        <label>Font Size: {{ fontSize() }}px</label>
        <input type="range" min="12" max="24" [value]="fontSize()" (input)="fontSize.set(+$any($event.target).value)" />
      </div>
      <div class="effect-preview" [attr.data-theme]="theme()" [style.font-size.px]="fontSize()">
        <strong>Preview Text</strong> — theme: {{ theme() }}, size: {{ fontSize() }}px
      </div>
      <div class="effect-log">
        <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">effect() log:</p>
        @for (entry of effectLog(); track $index) {
          <div class="log-line">{{ entry }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .effect-demo { display: flex; flex-direction: column; gap: 0.75rem; }
    .effect-preview { padding: 1rem; border-radius: 8px; transition: all 0.3s; border: 1px solid var(--color-border); }
    [data-theme="dark"] { background: #1a1a2e; color: #e2e8f0; }
    [data-theme="light"] { background: #f8fafc; color: #1e293b; }
    [data-theme="ocean"] { background: #0c4a6e; color: #e0f2fe; }
    .effect-log { max-height: 140px; overflow-y: auto; background: var(--color-surface-3); border-radius: 8px; padding: 0.5rem 0.75rem; }
    .log-line { font-family: 'Fira Code', monospace; font-size: 0.75rem; color: var(--color-text-secondary); padding: 2px 0; }
  `],
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
  template: `
    <div class="star-rating" role="radiogroup" [attr.aria-label]="'Rating: ' + value() + ' out of 5'">
      @for (star of stars; track star) {
        <button
          class="star-btn"
          [class.star-btn--filled]="star <= value()"
          [class.star-btn--hover]="star <= hovered()"
          (click)="value.set(star)"
          (mouseenter)="hovered.set(star)"
          (mouseleave)="hovered.set(0)"
          [attr.aria-label]="star + ' stars'"
          type="button"
        >★</button>
      }
      <span class="rating-label">{{ value() }}/5</span>
    </div>
  `,
  styles: [`
    .star-rating { display: flex; align-items: center; gap: 4px; }
    .star-btn { background: none; border: none; cursor: pointer; font-size: 1.5rem; color: var(--color-border-strong); padding: 2px; transition: all 0.15s; &--filled { color: #fbbf24; } &--hover { color: #fde68a; transform: scale(1.1); } }
    .rating-label { margin-left: 8px; font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary); }
  `],
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
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">⚡ Topic 3</p>
        <h1>Signals</h1>
        <p class="lead">
          Angular Signals are a reactive primitive that simplify state management
          and enable fine-grained change detection without Zone.js overhead.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li><code>signal(value)</code> — creates a writable reactive value; read it by calling it: <code>mySignal()</code></li>
          <li><code>computed(() =&gt; expr)</code> — derives a new signal; re-evaluates lazily when dependencies change</li>
          <li><code>effect(() =&gt; ...)</code> — runs a side effect whenever tracked signals change</li>
          <li><code>input()</code> / <code>input.required()</code> — signal-based component inputs (Angular 17.1+)</li>
          <li><code>model()</code> — two-way bindable signal (Angular 17.2+)</li>
          <li>Use <code>untracked()</code> to read signals inside an effect without creating a dependency</li>
          <li>Signals integrate with <code>OnPush</code> for optimal performance — no markForCheck needed</li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: Creating & Updating Signals -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Creating &amp; Updating Signals (set, update)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div class="signal-playground">
                <div class="sig-display">
                  <div class="sig-value">{{ counterSignal() }}</div>
                  <div class="sig-label">count signal</div>
                </div>
                <div class="sig-controls">
                  <button class="btn btn--secondary btn--sm" (click)="counterSignal.update(n => n - 1)">− Decrement</button>
                  <button class="btn btn--primary btn--sm" (click)="counterSignal.update(n => n + 1)">+ Increment</button>
                  <button class="btn btn--secondary btn--sm" (click)="counterSignal.set(0)">Reset</button>
                  <button class="btn btn--accent btn--sm" (click)="counterSignal.set(100)">Set 100</button>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.5rem; flex-wrap: wrap;">
                  <span style="font-size: 0.85rem; color: var(--color-text-secondary);">Status:</span>
                  <button class="btn btn--sm btn--secondary" (click)="statusSignal.set('online')">Online</button>
                  <button class="btn btn--sm btn--secondary" (click)="statusSignal.set('offline')">Offline</button>
                  <span class="status-chip" [class.status-chip--online]="statusSignal() === 'online'">
                    {{ statusSignal() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2: Readonly Exposure & Service State -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>Signal-based Service State (TaskService)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — TaskService state</p>
              <div class="task-stats">
                <div class="task-stat">
                  <span class="stat-val">{{ taskSvc.taskStats().total }}</span>
                  <span class="stat-lbl">Total</span>
                </div>
                <div class="task-stat">
                  <span class="stat-val" style="color: var(--color-success)">{{ taskSvc.taskStats().completed }}</span>
                  <span class="stat-lbl">Done</span>
                </div>
                <div class="task-stat">
                  <span class="stat-val" style="color: var(--color-warning)">{{ taskSvc.taskStats().pending }}</span>
                  <span class="stat-lbl">Pending</span>
                </div>
                <div class="task-stat">
                  <span class="stat-val" style="color: var(--color-primary-light)">{{ taskSvc.completionPercentage() }}%</span>
                  <span class="stat-lbl">Done %</span>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="taskSvc.completionPercentage()"></div>
              </div>
              <ul style="margin-top: 1rem; list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">
                @for (task of taskSvc.tasks(); track task.id) {
                  <li class="task-item" [class.task-item--done]="task.completed">
                    <input type="checkbox" [checked]="task.completed" (change)="taskSvc.toggleTask(task.id)" />
                    <span>{{ task.title }}</span>
                    <span class="task-priority task-priority--{{ task.priority }}">{{ task.priority }}</span>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- Example 3: computed() -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>computed() — Derived Reactive State</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — Shopping Cart with computed()</p>
              <app-cart-demo />
            </div>
          </div>
        </div>

        <!-- Example 4: effect() -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>effect() — Reactive Side Effects</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — effect() for theme persistence</p>
              <app-effect-demo />
            </div>
          </div>
        </div>

        <!-- Example 5: model() two-way signal -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>model() — Two-Way Bindable Signal Inputs</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal5" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — star rating with model()</p>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">Rate this tutorial:</p>
                  <app-star-rating [(value)]="parentRating" />
                </div>
                <div class="result-display">
                  Parent signal value: <strong>{{ parentRating() }}/5</strong>
                  @if (parentRating() === 5) { <span> — Thanks! ⭐</span> }
                  @if (parentRating() === 0) { <span style="color: var(--color-text-muted)"> — Not rated yet</span> }
                </div>
                <button class="btn btn--secondary btn--sm" (click)="parentRating.set(0)" style="align-self: flex-start;">Reset Rating</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 6: input() signal -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>input() — Signal-based Component Inputs</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSignal6" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — input() signal interactions</p>
              <div class="form-group" style="max-width: 300px;">
                <label>Name:</label>
                <input type="text" [value]="inputDemoName()" (input)="inputDemoName.set($any($event.target).value)" />
              </div>
              <div class="form-group">
                <label>Role:</label>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  @for (r of roles; track r) {
                    <button class="btn btn--sm" [class.btn--primary]="inputDemoRole() === r" [class.btn--secondary]="inputDemoRole() !== r" (click)="inputDemoRole.set(r)">{{ r }}</button>
                  }
                </div>
              </div>
              <div class="user-badge-demo">
                <div class="badge-avatar" [class]="'badge-avatar--' + inputDemoRole()">
                  {{ inputDemoName().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?' }}
                </div>
                <div>
                  <strong>{{ inputDemoName() || 'Enter a name' }}</strong>
                  <span class="role-tag role-tag--{{ inputDemoRole() }}">{{ inputDemoRole() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Create a <code>CounterComponent</code> with <code>signal()</code> and expose computed signals for doubled, squared values.</li>
          <li>Build a shopping cart service using signals and add computed signals for total price, item count, and discount.</li>
          <li>Write an <code>effect()</code> that persists the cart to <code>localStorage</code> whenever it changes, and use <code>untracked</code> for logging.</li>
          <li>Implement a <code>RangeInputComponent</code> using <code>model()</code> for two-way binding.</li>
          <li>Create a <code>SearchBoxComponent</code> using <code>input.required()</code> for the placeholder and an output signal for search events.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .signal-playground { display: flex; flex-direction: column; gap: 1rem; }
    .sig-display { text-align: center; padding: 1.5rem; background: var(--color-surface-3); border-radius: 12px; }
    .sig-value { font-size: 3.5rem; font-weight: 700; color: var(--color-primary-light); font-variant-numeric: tabular-nums; }
    .sig-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); margin-top: 0.25rem; }
    .sig-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .status-chip { padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: var(--color-surface-3); color: var(--color-text-muted); border: 1px solid var(--color-border); transition: all 0.2s; &--online { background: rgba(34,197,94,0.15); color: var(--color-success); border-color: rgba(34,197,94,0.3); } }
    .task-stats { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
    .task-stat { flex: 1; text-align: center; background: var(--color-surface-3); border-radius: 8px; padding: 0.75rem 0.5rem; }
    .stat-val { display: block; font-size: 1.5rem; font-weight: 700; }
    .stat-lbl { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); }
    .progress-bar { height: 6px; background: var(--color-surface-3); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light)); border-radius: 3px; transition: width 0.4s ease; }
    .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.875rem; &--done span:nth-child(2) { text-decoration: line-through; opacity: 0.5; } input[type=checkbox] { width: auto; cursor: pointer; } }
    .task-priority { margin-left: auto; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; &--high { color: var(--color-error); background: rgba(239,68,68,0.1); } &--medium { color: var(--color-warning); background: rgba(245,158,11,0.1); } &--low { color: var(--color-info); background: rgba(59,130,246,0.1); } }
    .user-badge-demo { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--color-surface-3); border-radius: 10px; }
    .badge-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; color: white; flex-shrink: 0; &--admin { background: var(--color-error); } &--editor { background: var(--color-warning); } &--viewer { background: var(--color-info); } }
    .role-tag { display: inline-block; margin-left: 0.5rem; padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; &--admin { background: rgba(239,68,68,0.15); color: #f87171; } &--editor { background: rgba(245,158,11,0.15); color: #fbbf24; } &--viewer { background: rgba(59,130,246,0.15); color: #60a5fa; } }
  `],
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
