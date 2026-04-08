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
  template: `
    <div class="anatomy-demo">
      <div class="anatomy-visual">
        <div class="block block--decorator">&#64;Component(&#123; selector, template, styles &#125;)</div>
        <div class="block block--class">
          <span class="kw">export class</span> <span class="cn">UserCardComponent</span> &#123;
          <div class="indent">
            <span class="prop">name</span> = signal(<em class="name-val">{{ nameDisplay }}</em>);
          </div>
          &#125;
        </div>
        <div class="block block--template">
          <span class="tag">&lt;div&gt;</span>Hello, &#123;&#123; name() &#125;&#125;<span class="tag">&lt;/div&gt;</span>
        </div>
      </div>
      <div class="anatomy-output">
        <p>Live Output: <strong>Hello, {{ name() }}</strong></p>
        <input
          type="text"
          [value]="name()"
          (input)="name.set($any($event.target).value)"
          placeholder="Enter a name..."
        />
      </div>
    </div>
  `,
  styles: [`
    .anatomy-demo { display: flex; flex-direction: column; gap: 1rem; }
    .anatomy-visual { display: flex; flex-direction: column; gap: 4px; }
    .block {
      padding: 10px 14px;
      border-radius: 8px;
      font-family: 'Fira Code', monospace;
      font-size: 0.82rem;
      line-height: 1.6;
      &--decorator { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fbbf24; }
      &--class { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25); color: #93c5fd; }
      &--template { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: #86efac; }
    }
    .indent { padding-left: 1.5rem; }
    .kw { color: #c084fc; }
    .cn { color: #67e8f9; }
    .prop { color: #fbbf24; }
    .str { color: #86efac; }
    .tag { color: #f87171; }
    .anatomy-output { background: var(--color-surface-3); border-radius: 8px; padding: 1rem; }
    .anatomy-output p { margin-bottom: 0.5rem; color: var(--color-text); }
    .anatomy-output strong { color: var(--color-primary-light); }
  `],
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
  template: `
    <div class="product-card" [class.product-card--featured]="featured()">
      @if (featured()) {
        <div class="featured-badge">&#11088; Featured</div>
      }
      <div class="product-info">
        <h4>{{ name() }}</h4>
        <p class="price">\${{ price().toFixed(2) }}</p>
        <div class="rating">
          @for (star of stars(); track $index) {
            <span class="star" [class.star--filled]="star">&#9733;</span>
          }
        </div>
      </div>
      <button class="btn btn--primary btn--sm" (click)="addToCart.emit({ name: name(), price: price() })">
        Add to Cart
      </button>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--color-surface-3);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.25rem;
      position: relative;
      transition: all 0.2s;
      &--featured { border-color: rgba(245,158,11,0.5); box-shadow: 0 0 12px rgba(245,158,11,0.15); }
    }
    .featured-badge { position: absolute; top: -10px; right: 12px; background: rgba(245,158,11,0.9); color: #1a1a2e; font-size: 0.7rem; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
    .product-info h4 { margin: 0 0 0.3rem; }
    .price { font-size: 1.25rem; font-weight: 700; color: var(--color-success); margin: 0 0 0.5rem; }
    .rating { margin-bottom: 0.75rem; }
    .star { color: var(--color-border-strong); font-size: 1rem; &--filled { color: #fbbf24; } }
  `],
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
  template: `
    <div class="lifecycle-log">
      <ul class="log-list">
        @for (entry of log(); track entry.timestamp) {
          <li class="log-entry" [class]="'log-entry--' + entry.hook">
            <span class="hook-name">{{ entry.hook }}</span>
            <span class="hook-msg">{{ entry.message }}</span>
            <span class="hook-time">{{ entry.timestamp }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .lifecycle-log { max-height: 220px; overflow-y: auto; }
    .log-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
    .log-entry {
      display: flex; gap: 8px; align-items: baseline; padding: 6px 10px; border-radius: 6px; font-size: 0.8rem;
      &--constructor { background: rgba(139,92,246,0.1); border-left: 3px solid #8b5cf6; }
      &--ngOnInit { background: rgba(34,197,94,0.1); border-left: 3px solid #22c55e; }
      &--ngOnDestroy { background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; }
    }
    .hook-name { font-weight: 700; width: 120px; flex-shrink: 0; font-family: 'Fira Code', monospace; font-size: 0.75rem; }
    .hook-msg { flex: 1; color: var(--color-text-secondary); }
    .hook-time { color: var(--color-text-muted); font-size: 0.7rem; }
  `],
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
  template: `
    <div class="cd-demo">
      <div class="cd-counter">
        <div class="counter-display">{{ count() }}</div>
        <p>OnPush component only re-renders when signal changes</p>
      </div>
      <div class="cd-controls">
        <button class="btn btn--primary btn--sm" (click)="increment()">+ Increment</button>
        <button class="btn btn--secondary btn--sm" (click)="reset()">Reset</button>
      </div>
      <div class="cd-info">
        <div class="info-row">
          <span>Change Detection Strategy:</span>
          <code>OnPush</code>
        </div>
        <div class="info-row">
          <span>State Management:</span>
          <code>signal()</code>
        </div>
        <div class="info-row">
          <span>Render count:</span>
          <strong>{{ renderCount }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cd-demo { display: flex; flex-direction: column; gap: 1rem; }
    .cd-counter { text-align: center; padding: 1.5rem; background: var(--color-surface-3); border-radius: 12px; }
    .counter-display { font-size: 4rem; font-weight: 700; color: var(--color-primary-light); line-height: 1; margin-bottom: 0.5rem; }
    .cd-controls { display: flex; gap: 0.5rem; }
    .cd-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; }
    .info-row strong { color: var(--color-success); }
  `],
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
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <ng-content select="[slot=title]" />
            <button class="modal__close" (click)="closeModal()">&#x2715;</button>
          </div>
          <div class="modal__body">
            <ng-content />
          </div>
          <div class="modal__footer">
            <ng-content select="[slot=footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: var(--color-surface); border: 1px solid var(--color-border-strong); border-radius: 16px; width: min(480px, 90vw); overflow: hidden; }
    .modal__header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border); }
    .modal__body { padding: 1.5rem; }
    .modal__footer { padding: 1rem 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: 0.5rem; }
    .modal__close { background: none; border: none; color: var(--color-text-secondary); cursor: pointer; font-size: 1rem; padding: 4px 8px; border-radius: 6px; transition: all 0.15s; &:hover { background: var(--color-surface-3); color: var(--color-text); } }
  `],
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
  template: `
    <span class="dot"></span>
    <span class="label">{{ statusLabel() }}</span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid currentColor;
    }
    :host(.status-indicator--online) { color: var(--color-success); background: rgba(34,197,94,0.1); }
    :host(.status-indicator--offline) { color: var(--color-text-muted); background: rgba(100,116,139,0.1); }
    :host(.status-indicator--busy) { color: var(--color-warning); background: rgba(245,158,11,0.1); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .label { text-transform: capitalize; }
  `],
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
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">&#x1F9E9; Topic 1</p>
        <h1>Components</h1>
        <p class="lead">
          Components are the fundamental building blocks of Angular applications.
          Each component encapsulates a TypeScript class, HTML template, and CSS styles.
        </p>
      </header>

      <div class="theory-box">
        <h4>&#x1F4D6; Theory</h4>
        <ul>
          <li>A component is a TypeScript class decorated with <code>&#64;Component()</code></li>
          <li>The decorator provides <code>selector</code>, <code>template</code>/<code>templateUrl</code>, and <code>styles</code>/<code>styleUrls</code></li>
          <li>Use <code>ChangeDetectionStrategy.OnPush</code> for performance — only re-renders when inputs change or signals emit</li>
          <li>In Angular 17+, standalone components are the default — no NgModules needed</li>
          <li>Use <code>input()</code> / <code>output()</code> signal APIs instead of <code>&#64;Input()</code>/<code>&#64;Output()</code></li>
        </ul>
      </div>

      <!-- Examples Section -->
      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Component Anatomy</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              The three parts of a component: decorator, class, and template. Edit the name below to see reactive updates.
            </p>
            <app-code [code]="code1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <app-ex1-anatomy />
            </div>
          </div>
        </div>

        <!-- Example 2 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>Input Signals &amp; Output Events</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              Use <code>input()</code> for typed, required or optional props. Use <code>output()</code> for events.
            </p>
            <app-code [code]="code2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <app-product-card
                  name="Mechanical Keyboard"
                  [price]="149.99"
                  [rating]="5"
                  [featured]="true"
                  (addToCart)="onAddToCart($event)"
                />
                <app-product-card
                  name="Wireless Mouse"
                  [price]="59.99"
                  [rating]="4"
                  (addToCart)="onAddToCart($event)"
                />
              </div>
              @if (cartMessage()) {
                <div class="result-display" style="margin-top: 0.75rem;">
                  &#x1F6D2; {{ cartMessage() }}
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 3 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>Lifecycle Hooks</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              Angular calls lifecycle hook methods in a specific order. Key hooks: constructor → ngOnInit → ngOnDestroy.
            </p>
            <app-code [code]="code3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — hook log</p>
              @if (showLifecycleDemo()) {
                <app-ex3-lifecycle />
              } @else {
                <p style="color: var(--color-text-muted); font-size: 0.85rem;">Component not yet mounted.</p>
              }
              <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn--primary btn--sm" (click)="showLifecycleDemo.set(true)">Mount Component</button>
                <button class="btn btn--secondary btn--sm" (click)="showLifecycleDemo.set(false)">Destroy Component</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>ChangeDetection.OnPush</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              <code>OnPush</code> is a performance optimization. With signals, Angular only checks this component when signal values change.
            </p>
            <app-code [code]="code4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <app-ex4-change-detection />
            </div>
          </div>
        </div>

        <!-- Example 5 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Content Projection with ng-content</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              <code>ng-content</code> enables composition patterns. Use named slots for structured content projection.
            </p>
            <app-code [code]="code5" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <button class="btn btn--primary btn--sm" (click)="modalRef.open()">Open Modal</button>
              <app-modal-shell #modalRef>
                <h3 slot="title">Content Projection Demo</h3>
                <p>This content is projected into the modal body via <code>ng-content</code>.</p>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary);">
                  Each slot maps to a different <code>ng-content select</code> in the modal shell.
                </p>
                <div slot="footer">
                  <button class="btn btn--secondary btn--sm" (click)="modalRef.closeModal()">Cancel</button>
                  <button class="btn btn--primary btn--sm" (click)="modalRef.closeModal()">Confirm</button>
                </div>
              </app-modal-shell>
            </div>
          </div>
        </div>

        <!-- Example 6 -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>Host Bindings &amp; Semantic HTML</h3>
          </div>
          <div class="example-container__body">
            <p style="margin-bottom: 1rem; color: var(--color-text-secondary); font-size: 0.9rem;">
              Use the <code>host</code> option in <code>&#64;Component</code> to bind classes, attributes and ARIA to the host element directly.
            </p>
            <app-code [code]="code6" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem;">
                <app-status-indicator status="online" />
                <app-status-indicator status="offline" />
                <app-status-indicator status="busy" />
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span style="font-size: 0.85rem; color: var(--color-text-secondary);">Selected:</span>
                <button class="btn btn--sm btn--secondary" (click)="selectedStatus.set('online')">Online</button>
                <button class="btn btn--sm btn--secondary" (click)="selectedStatus.set('offline')">Offline</button>
                <button class="btn btn--sm btn--secondary" (click)="selectedStatus.set('busy')">Busy</button>
              </div>
              <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                <app-status-indicator [status]="selectedStatus()" />
                <span style="font-size: 0.85rem; color: var(--color-text-secondary);">Dynamic status</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>&#x1F3CB;&#xFE0F; Exercises</h4>
        <ol>
          <li>Create a <code>UserCardComponent</code> with inputs for <code>name</code>, <code>email</code>, <code>role</code>, and an output <code>profileClicked</code>.</li>
          <li>Add a <code>ngOnInit</code> hook that logs when the component mounts and a <code>ngOnDestroy</code> that logs cleanup.</li>
          <li>Build a reusable <code>AccordionComponent</code> using content projection with a <code>[slot=header]</code> named slot.</li>
          <li>Apply <code>ChangeDetectionStrategy.OnPush</code> to all of the above and verify they still update correctly.</li>
          <li>Add host bindings to the <code>UserCardComponent</code> to apply a CSS class based on the user's role.</li>
        </ol>
      </div>
    </div>
  `,
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
