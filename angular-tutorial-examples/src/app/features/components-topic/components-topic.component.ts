import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';

/* ──────────────────────────────────────────────
   Example 1 - Component Anatomy
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-ex1-anatomy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ex1-anatomy.component.html',
  styleUrl: './ex1-anatomy.component.scss',
})
export class Ex1AnatomyComponent {
  readonly name = signal('Angular Developer');
  get nameDisplay(): string { return this.name(); }
}

/* ──────────────────────────────────────────────
   Example 2 - Input Signals & Outputs
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly name = input.required<string>();
  readonly price = input.required<number>();
  readonly rating = input<number>(0);
  readonly featured = input<boolean>(false);
  readonly addToCart = output<{ name: string; price: number }>();

  readonly stars = computed(() => {
    const r = Math.round(this.rating());
    return Array.from({ length: 5 }, (_, i) => i < r);
  });
}

/* ──────────────────────────────────────────────
   Example 3 - Lifecycle Hooks Demo
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-ex3-lifecycle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ex3-lifecycle.component.html',
  styleUrl: './ex3-lifecycle.component.scss',
})
export class Ex3LifecycleComponent implements OnInit, OnDestroy {
  readonly log = signal<Array<{ hook: string; message: string; timestamp: string }>>([]);

  constructor() {
    this.addLog('constructor', 'Component instance created, class properties initialized.');
  }

  ngOnInit(): void {
    this.addLog('ngOnInit', 'Inputs are ready. Fetch data, subscribe to observables here.');
  }

  ngOnDestroy(): void {
    this.addLog('ngOnDestroy', 'Cleanup: unsubscribe, clear timers, release resources.');
  }

  private addLog(hook: string, message: string): void {
    this.log.update(l => [...l, { hook, message, timestamp: new Date().toLocaleTimeString() }]);
  }
}

/* ──────────────────────────────────────────────
   Example 4 - ChangeDetection OnPush
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-ex4-change-detection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ex4-change-detection.component.html',
  styleUrl: './ex4-change-detection.component.scss',
})
export class Ex4ChangeDetectionComponent {
  readonly count = signal(0);
  renderCount = 0;

  increment(): void { this.count.update(n => n + 1); this.renderCount++; }
  reset(): void { this.count.set(0); this.renderCount = 0; }
}

/* ──────────────────────────────────────────────
   Example 5 - Content Projection (ng-content)
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss',
})
export class ModalShellComponent {
  readonly isOpen = signal(false);
  open(): void { this.isOpen.set(true); }
  closeModal(): void { this.isOpen.set(false); }
}

/* ──────────────────────────────────────────────
   Example 6 - Host Bindings & Attributes
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-status-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"status-indicator status-indicator--" + status()',
    '[attr.aria-label]': '"Status: " + status()',
    'role': 'status',
  },
  templateUrl: './status-indicator.component.html',
  styleUrl: './status-indicator.component.scss',
})
export class StatusIndicatorComponent {
  readonly status = input<'online' | 'offline' | 'busy'>('offline');

  readonly statusLabel = computed(() => {
    const labels: Record<string, string> = {
      online: 'Online',
      offline: 'Offline',
      busy: 'Busy',
    };
    return labels[this.status()] ?? this.status();
  });
}

/* ──────────────────────────────────────────────
   Main Topic Page
   ────────────────────────────────────────────── */
@Component({
  selector: 'app-components-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CodeSnippetComponent,
    Ex1AnatomyComponent,
    ProductCardComponent,
    Ex3LifecycleComponent,
    Ex4ChangeDetectionComponent,
    ModalShellComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './components-topic.component.html',
  styleUrl: './components-topic.component.scss',
})
export class ComponentsTopicComponent {
  readonly cartMessage = signal<string>('');
  readonly showLifecycleDemo = signal(false);
  readonly selectedStatus = signal<'online' | 'offline' | 'busy'>('online');

  onAddToCart(item: { name: string; price: number }): void {
    this.cartMessage.set(`Added "${item.name}" — $${item.price.toFixed(2)}`);
    setTimeout(() => this.cartMessage.set(''), 3000);
  }

  readonly code1 = `@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`Hello {{ name() }}\`,
})
export class UserCardComponent {
  readonly name = signal('Angular Developer');
}`;

  readonly code2 = `// Type-safe inputs with required()
readonly name = input.required<string>();
readonly price = input.required<number>();
readonly rating = input<number>(0);       // with default
readonly featured = input<boolean>(false);

// Typed output
readonly addToCart = output<{ name: string; price: number }>();`;

  readonly code3 = `export class MyComponent implements OnInit, OnDestroy {
  // constructor: DI & property init
  constructor(private svc: MyService) {}

  // ngOnInit: safe to access inputs & run effects
  ngOnInit(): void {
    this.svc.loadData().subscribe(...);
  }

  // ngOnDestroy: cleanup
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}`;

  readonly code4 = `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Best practice for all signal-based components
})
export class PerfComponent {
  readonly count = signal(0); // triggers re-render on .set()/.update()
}`;

  readonly code5 = `// Component definition
template: \`
  <ng-content select="[slot=title]" />  <!-- named slot -->
  <ng-content />                          <!-- default slot -->
  <ng-content select="[slot=footer]" />
\`

// Usage
<app-modal-shell>
  <h2 slot="title">My Modal</h2>
  <p>Modal body content...</p>
  <button slot="footer">Confirm</button>
</app-modal-shell>`;

  readonly code6 = `@Component({
  host: {
    '[class]': '"status-indicator status-indicator--" + status()',
    '[attr.aria-label]': '"Status: " + status()',
    'role': 'status',
  },
})
export class StatusIndicatorComponent {
  readonly status = input<'online' | 'offline' | 'busy'>('offline');
}`;
}
