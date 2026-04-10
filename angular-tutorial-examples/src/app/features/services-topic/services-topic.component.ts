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
  templateUrl: './services-topic.component.html',
  styleUrl: './services-topic.component.scss',
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
