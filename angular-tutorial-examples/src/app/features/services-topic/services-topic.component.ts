import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  InjectionToken,
  Injectable,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';

/* ─────────────────────────────────────────────────────────
   Example 3 - InjectionToken
   ───────────────────────────────────────────────────────── */
export interface AppConfig {
  readonly apiUrl: string;
  readonly maxRetries: number;
  readonly featureFlags: Readonly<{ darkMode: boolean; betaFeatures: boolean }>;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'https://api.example.com',
  maxRetries: 3,
  featureFlags: { darkMode: true, betaFeatures: false },
};

/* ─────────────────────────────────────────────────────────
   Example 4 - Logger Service (hierarchical DI)
   ───────────────────────────────────────────────────────── */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: Date;
  readonly context?: string;
}

@Injectable() // no providedIn — allows hierarchical injection
export class LoggerService {
  private readonly _logs = signal<LogEntry[]>([]);
  readonly logs = this._logs.asReadonly();

  private context?: string;

  withContext(context: string): LoggerService {
    const scoped = new LoggerService();
    scoped.context = context;
    return scoped;
  }

  debug(message: string): void { this.log('debug', message); }
  info(message: string): void  { this.log('info', message); }
  warn(message: string): void  { this.log('warn', message); }
  error(message: string): void { this.log('error', message); }

  private log(level: LogLevel, message: string): void {
    const entry: LogEntry = { level, message, timestamp: new Date(), context: this.context };
    this._logs.update(l => [...l.slice(-19), entry]);
  }
}

/* ─────────────────────────────────────────────────────────
   Example 5 - Counter Service with factory pattern
   ───────────────────────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly _value = signal(0);
  readonly value = this._value.asReadonly();
  readonly doubled = computed(() => this._value() * 2);
  readonly isEven = computed(() => this._value() % 2 === 0);

  increment(step = 1): void { this._value.update(n => n + step); }
  decrement(step = 1): void { this._value.update(n => n - step); }
  reset(): void { this._value.set(0); }
}

/* ─────────────────────────────────────────────────────────
   Main Services Topic Page
   ───────────────────────────────────────────────────────── */
@Component({
  selector: 'app-services-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TitleCasePipe, CodeSnippetComponent],
  providers: [
    LoggerService,
    { provide: APP_CONFIG, useValue: DEFAULT_CONFIG },
  ],
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">🔧 Topic 4</p>
        <h1>Services & Dependency Injection</h1>
        <p class="lead">
          Angular's DI system provides services to components and other services.
          Use <code>inject()</code> for cleaner injection without constructor boilerplate.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li><code>@Injectable({{ '{' }} providedIn: 'root' {{ '}' }})</code> — singleton, tree-shakeable</li>
          <li><code>inject(Token)</code> — functional injection, works in constructor context and in computed/effect</li>
          <li><code>InjectionToken&lt;T&gt;</code> — provides non-class tokens (config objects, primitives)</li>
          <li><code>providers: []</code> in component — component-scoped instance (not shared globally)</li>
          <li><strong>Hierarchical DI</strong> — child injectors inherit from parent; override at any level</li>
          <li>Prefer <code>inject()</code> over constructor injection for consistency and testability</li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: inject() function -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>inject() — Functional Dependency Injection</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — inject() with multiple services</p>
              <div class="service-demo">
                <div class="service-item">
                  <span class="service-icon">🔔</span>
                  <div>
                    <strong>NotificationService</strong>
                    <p>{{ notifCount() }} active notifications</p>
                  </div>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn--sm btn--primary" (click)="notifSvc.success('Operation succeeded!')">Success</button>
                    <button class="btn btn--sm btn--secondary" (click)="notifSvc.error('Something went wrong')">Error</button>
                    <button class="btn btn--sm btn--accent" (click)="notifSvc.info('FYI: new update')">Info</button>
                  </div>
                </div>
                <div class="service-item">
                  <span class="service-icon">🛍️</span>
                  <div>
                    <strong>ProductService</strong>
                    <p>{{ productSvc.filteredProducts().length }} / {{ productSvc.products().length }} products visible</p>
                  </div>
                  <div style="display: flex; gap: 0.4rem; align-items: center;">
                    <input type="text" style="width: 150px; font-size: 0.8rem; padding: 6px 10px;"
                      placeholder="Search products..."
                      (input)="productSvc.searchQuery.set($any($event.target).value)"
                    />
                    <button class="btn btn--sm btn--secondary" (click)="productSvc.searchQuery.set('')">Clear</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2: Service with signal state -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>CounterService — Singleton Signal State</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — shared singleton across components</p>
              <div class="counter-grid">
                @for (i of [1,2,3]; track i) {
                  <div class="counter-instance">
                    <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Instance {{ i }} — same service</p>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary-light); text-align: center; margin-bottom: 0.5rem;">
                      {{ counterSvc.value() }}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary); text-align: center; margin-bottom: 0.75rem;">
                      × 2 = {{ counterSvc.doubled() }} &nbsp;|&nbsp; {{ counterSvc.isEven() ? 'even' : 'odd' }}
                    </div>
                    <div style="display: flex; gap: 0.4rem; justify-content: center;">
                      <button class="btn btn--sm btn--secondary" (click)="counterSvc.decrement()">−</button>
                      <button class="btn btn--sm btn--primary" (click)="counterSvc.increment()">+</button>
                    </div>
                  </div>
                }
              </div>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.75rem; text-align: center;">
                All 3 instances read from the SAME singleton service — changes propagate everywhere.
              </p>
            </div>
          </div>
        </div>

        <!-- Example 3: InjectionToken -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>InjectionToken — Typed Configuration</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — InjectionToken config</p>
              <div class="config-display">
                <div class="config-item">
                  <code>apiUrl</code>
                  <span>{{ config.apiUrl }}</span>
                </div>
                <div class="config-item">
                  <code>maxRetries</code>
                  <span>{{ config.maxRetries }}</span>
                </div>
                <div class="config-item">
                  <code>featureFlags.darkMode</code>
                  <span [class]="config.featureFlags.darkMode ? 'flag-on' : 'flag-off'">
                    {{ config.featureFlags.darkMode ? 'enabled' : 'disabled' }}
                  </span>
                </div>
                <div class="config-item">
                  <code>featureFlags.betaFeatures</code>
                  <span [class]="config.featureFlags.betaFeatures ? 'flag-on' : 'flag-off'">
                    {{ config.featureFlags.betaFeatures ? 'enabled' : 'disabled' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4: Logger Service (non-root, component-scoped) -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>LoggerService — Component-Scoped Provider</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — component-scoped logger</p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                @for (action of logActions; track action.label) {
                  <button class="btn btn--sm btn--secondary"
                    (click)="logger[action.level](action.label)"
                  >{{ action.label }}</button>
                }
              </div>
              <div class="logger-view">
                @for (entry of logger.logs(); track entry.timestamp) {
                  <div class="log-row log-row--{{ entry.level }}">
                    <span class="log-level">{{ entry.level }}</span>
                    <span class="log-msg">{{ entry.message }}</span>
                    <span class="log-ts">{{ entry.timestamp | date:'HH:mm:ss' }}</span>
                  </div>
                } @empty {
                  <p style="color: var(--color-text-muted); font-size: 0.85rem; text-align: center; padding: 1rem;">No logs yet. Click actions above.</p>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Example 5: useFactory provider -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Provider Patterns: useValue, useClass, useFactory, useExisting</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet5" />
            <div class="demo-area">
              <p class="demo-label">Provider Pattern Summary</p>
              <div class="provider-table">
                @for (pattern of providerPatterns; track pattern.name) {
                  <div class="provider-row">
                    <code>{{ pattern.name }}</code>
                    <span>{{ pattern.useCase }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Example 6: ProductService - real world usage -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>ProductService — Real-World Service Pattern</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet6" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — ProductService with filtering</p>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                <input type="text" placeholder="Search products..." style="flex: 1; min-width: 180px;"
                  [value]="productSvc.searchQuery()"
                  (input)="productSvc.searchQuery.set($any($event.target).value)"
                />
                <select (change)="productSvc.selectedCategory.set($any($event.target).value)">
                  @for (cat of productSvc.categories(); track cat) {
                    <option [value]="cat">{{ cat | titlecase }}</option>
                  }
                </select>
              </div>
              <div class="product-list">
                @for (product of productSvc.filteredProducts().slice(0, 4); track product.id) {
                  <div class="product-row">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-cat">{{ product.category }}</span>
                    <span class="product-price">\${{ product.price.toFixed(2) }}</span>
                    <span class="product-stock" [class.in-stock]="product.inStock">
                      {{ product.inStock ? '✓' : '✕' }}
                    </span>
                  </div>
                } @empty {
                  <p style="text-align: center; color: var(--color-text-muted); padding: 1rem; font-size: 0.85rem;">No products match.</p>
                }
              </div>
              <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">
                Showing {{ productSvc.filteredProducts().length }} of {{ productSvc.products().length }} products
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Create a <code>ThemeService</code> with a signal for current theme and a method to toggle between light/dark/system.</li>
          <li>Define an <code>InjectionToken</code> for an <code>FeatureFlags</code> config object and inject it in a component.</li>
          <li>Build a <code>CartService</code> that provides a component-scoped cart and a root-scoped order history service.</li>
          <li>Implement a <code>useFactory</code> provider that creates a service instance conditionally based on environment.</li>
          <li>Write a <code>LoggerService</code> that uses <code>withContext()</code> to create scoped loggers and injects <code>APP_CONFIG</code> for log level.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .service-demo { display: flex; flex-direction: column; gap: 0.75rem; }
    .service-item { display: flex; align-items: center; gap: 1rem; padding: 12px 16px; background: var(--color-surface-3); border-radius: 10px; flex-wrap: wrap; }
    .service-icon { font-size: 1.5rem; width: 36px; flex-shrink: 0; }
    .service-item > div:nth-child(2) { flex: 1; min-width: 0; p { margin: 0; font-size: 0.82rem; } }
    .counter-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
    .counter-instance { background: var(--color-surface-3); border-radius: 10px; padding: 1rem; }
    .config-display { display: flex; flex-direction: column; gap: 0.5rem; }
    .config-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; }
    .flag-on { color: var(--color-success); font-weight: 600; }
    .flag-off { color: var(--color-text-muted); }
    .logger-view { max-height: 200px; overflow-y: auto; background: var(--color-surface-3); border-radius: 8px; padding: 0.5rem; }
    .log-row { display: flex; gap: 8px; align-items: baseline; padding: 4px 6px; border-radius: 4px; font-size: 0.78rem; &--debug { color: #94a3b8; } &--info { color: #60a5fa; } &--warn { color: #fbbf24; } &--error { color: #f87171; } }
    .log-level { font-weight: 700; text-transform: uppercase; width: 40px; flex-shrink: 0; font-family: 'Fira Code', monospace; }
    .log-msg { flex: 1; }
    .log-ts { color: var(--color-text-muted); }
    .provider-table { display: flex; flex-direction: column; gap: 4px; }
    .provider-row { display: flex; gap: 1rem; align-items: center; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; code { background: rgba(59,130,246,0.1); color: #60a5fa; border-color: rgba(59,130,246,0.25); width: 120px; flex-shrink: 0; } }
    .product-list { display: flex; flex-direction: column; gap: 4px; }
    .product-row { display: flex; align-items: center; gap: 0.75rem; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; }
    .product-name { flex: 1; font-weight: 500; }
    .product-cat { color: var(--color-text-muted); font-size: 0.78rem; }
    .product-price { font-family: 'Fira Code', monospace; color: var(--color-success); }
    .product-stock { width: 20px; text-align: center; color: var(--color-error); &.in-stock { color: var(--color-success); } }
  `],
})
export class ServicesTopicComponent {
  readonly notifSvc = inject(NotificationService);
  readonly productSvc = inject(ProductService);
  readonly counterSvc = inject(CounterService);
  readonly logger = inject(LoggerService);
  readonly config = inject(APP_CONFIG);

  readonly notifCount = computed(() => this.notifSvc.notifications().length);

  readonly logActions: Array<{ label: string; level: keyof LoggerService }> = [
    { label: 'User login', level: 'info' },
    { label: 'Cart updated', level: 'debug' },
    { label: 'Network timeout', level: 'warn' },
    { label: 'Auth failed', level: 'error' },
    { label: 'Data loaded', level: 'info' },
  ];

  readonly providerPatterns: Array<{ name: string; useCase: string }> = [
    { name: 'useValue', useCase: 'Provide static values, configs, constants' },
    { name: 'useClass', useCase: 'Swap implementations (e.g. mock in tests)' },
    { name: 'useFactory', useCase: 'Create instance with custom logic or async' },
    { name: 'useExisting', useCase: 'Alias one token to an existing provider' },
    { name: 'multi: true', useCase: 'Collect multiple providers into an array' },
  ];

  /* ── Code snippets ── */
  readonly codeSnippet1 = `// ✅ Preferred modern approach: inject()
@Component({...})
export class MyComponent {
  // No constructor boilerplate needed
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);

  // inject() in field initializers (runs in injection context)
  readonly user = this.authService.currentUser;
}

// ✅ Also works in standalone functions
function loadUserFn(): Observable<User> {
  const http = inject(HttpClient);
  return http.get<User>('/api/me');
}`;
  readonly codeSnippet2 = `@Injectable({ providedIn: 'root' })
export class CounterService {
  private readonly _value = signal(0);

  // Expose as read-only signal — consumers can't mutate directly
  readonly value = this._value.asReadonly();
  readonly doubled = computed(() => this._value() * 2);
  readonly isEven = computed(() => this._value() % 2 === 0);

  increment(step = 1): void { this._value.update(n => n + step); }
  decrement(step = 1): void { this._value.update(n => n - step); }
  reset(): void { this._value.set(0); }
}`;
  readonly codeSnippet3 = `// Define the token with a type parameter
export interface AppConfig {
  readonly apiUrl: string;
  readonly maxRetries: number;
  readonly featureFlags: { darkMode: boolean };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// Provide in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: '/api', maxRetries: 3, ... } },
    // or useFactory for computed values:
    { provide: APP_CONFIG, useFactory: () => loadConfigFromEnvironment() },
  ]
};

// Inject anywhere
readonly config = inject(APP_CONFIG);`;
  readonly codeSnippet4 = `// Service without providedIn — injected per component
@Injectable()
export class LoggerService {
  private readonly _logs = signal<LogEntry[]>([]);
  readonly logs = this._logs.asReadonly();

  withContext(context: string): LoggerService {
    const scoped = new LoggerService();
    scoped.context = context;
    return scoped;
  }

  info(message: string): void { ... }
}

// Component provides its own instance
@Component({
  providers: [LoggerService], // new instance per component subtree
})
export class DashboardComponent {
  private readonly logger = inject(LoggerService);
}`;
  readonly codeSnippet5 = `// useValue — static value
{ provide: API_URL, useValue: 'https://api.example.com' }

// useClass — use different implementation in test/prod
{ provide: AuthService, useClass: MockAuthService } // for tests

// useFactory — computed/async providers
{
  provide: DatabaseConnection,
  useFactory: (config: AppConfig) => new DatabaseConnection(config.dbUrl),
  deps: [APP_CONFIG]
}

// useExisting — alias one token to another
{ provide: Logger, useExisting: LoggerService }

// Multi-providers — inject array of all values
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }`;
  readonly codeSnippet6 = `@Injectable({ providedIn: 'root' })
export class ProductService {
  // Private mutable signal
  private readonly _products = signal<Product[]>([]);

  // Public writable signals for filter state
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<Category | 'all'>('all');

  // Computed signal — automatically re-derives on any dep change
  readonly filteredProducts = computed(() => {
    let result = [...this._products()];
    const query = this.searchQuery().toLowerCase();
    if (query) result = result.filter(p => p.name.includes(query));
    // ... more filters
    return result;
  });
}`;
}
