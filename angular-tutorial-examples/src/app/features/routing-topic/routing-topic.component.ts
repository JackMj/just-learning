import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';

/* ─────────────────────────────────────────────────────────
   Route Guard Demo (mock)
   ───────────────────────────────────────────────────────── */
interface RouteScenario {
  readonly label: string;
  readonly path: string;
  readonly protected: boolean;
  readonly requiresParam: boolean;
}

@Component({
  selector: 'app-routing-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CodeSnippetComponent],
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">🗺️ Topic 5</p>
        <h1>Routing</h1>
        <p class="lead">
          Angular Router handles navigation between views, provides route parameters,
          lazy loading, guards and resolvers.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li><code>provideRouter(routes)</code> in <code>app.config.ts</code> — standalone app router setup</li>
          <li><code>RouterLink</code> / <code>RouterLinkActive</code> — declarative navigation</li>
          <li><code>Router.navigate()</code> / <code>navigateByUrl()</code> — programmatic navigation</li>
          <li><code>ActivatedRoute</code> — access route params, query params, data, and state</li>
          <li><strong>Lazy loading</strong> — <code>loadComponent</code> or <code>loadChildren</code> splits bundles</li>
          <li><strong>Route Guards</strong> — <code>canActivate</code>, <code>canMatch</code>, <code>canDeactivate</code></li>
          <li><strong>Resolvers</strong> — pre-fetch data before a route activates</li>
          <li>Use <code>withComponentInputBinding()</code> so route params map to component inputs</li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: Route Definition -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Route Definition & provideRouter()</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet1" />
            <div class="demo-area">
              <p class="demo-label">Route tree visualization</p>
              <div class="route-tree">
                @for (route of routeTree; track route.path) {
                  <div class="route-node" [style.padding-left.rem]="route.depth * 1.5">
                    <span class="route-icon">{{ route.icon }}</span>
                    <code>/{{ route.path }}</code>
                    @if (route.guard) {
                      <span class="route-badge route-badge--guard">🔒 {{ route.guard }}</span>
                    }
                    @if (route.lazy) {
                      <span class="route-badge route-badge--lazy">⚡ lazy</span>
                    }
                    @if (route.note) {
                      <span class="route-note">{{ route.note }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2: RouterLink & RouterLinkActive -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>RouterLink, RouterLinkActive & queryParams</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — mock navigation bar</p>
              <nav class="mock-nav">
                @for (topic of navLinks; track topic.path) {
                  <a
                    [routerLink]="topic.path"
                    routerLinkActive="mock-nav__item--active"
                    [routerLinkActiveOptions]="{ exact: topic.exact ?? false }"
                    class="mock-nav__item"
                  >{{ topic.label }}</a>
                }
              </nav>
              <div style="margin-top: 0.75rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn btn--sm btn--primary" (click)="router.navigate(['/components'])">Navigate to Components</button>
                <button class="btn btn--sm btn--secondary" (click)="router.navigate(['/signals'])">Navigate to Signals</button>
                <button class="btn btn--sm btn--accent" (click)="router.navigate(['/'], { queryParams: { section: 'examples' } })">Home + queryParams</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 3: Route Parameters -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>Route Parameters & withComponentInputBinding()</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — simulating route params</p>
              <div class="param-demo">
                <div class="param-controls">
                  <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">Select a "user" to navigate to:</p>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    @for (user of demoUsers; track user.id) {
                      <button
                        class="btn btn--sm"
                        [class.btn--primary]="selectedUserId() === user.id"
                        [class.btn--secondary]="selectedUserId() !== user.id"
                        (click)="selectedUserId.set(user.id)"
                      >{{ user.name }}</button>
                    }
                  </div>
                </div>
                @if (selectedUser()) {
                  <div class="user-detail-card">
                    <div class="user-avatar">{{ selectedUser()!.name.charAt(0) }}</div>
                    <div>
                      <strong>{{ selectedUser()!.name }}</strong>
                      <p>{{ selectedUser()!.email }}</p>
                      <code style="font-size: 0.75rem;">/users/{{ selectedUser()!.id }}</code>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4: Route Guards -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>Route Guards — canActivate & canDeactivate</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — guard simulator</p>
              <div class="guard-demo">
                <div class="auth-toggle">
                  <span style="font-size: 0.85rem;">Authenticated:</span>
                  <button
                    class="btn btn--sm"
                    [class.btn--primary]="isAuthenticated()"
                    [class.btn--secondary]="!isAuthenticated()"
                    (click)="isAuthenticated.update(v => !v)"
                  >{{ isAuthenticated() ? '✓ Yes' : '✕ No' }}</button>
                </div>
                <div class="routes-list">
                  @for (scenario of guardScenarios; track scenario.path) {
                    <div class="guard-route">
                      <code>/{{ scenario.path }}</code>
                      @if (scenario.protected) {
                        <span class="guard-lock">🔒 Protected</span>
                      }
                      <button
                        class="btn btn--sm btn--accent"
                        (click)="tryNavigate(scenario)"
                      >Navigate</button>
                      @if (navigationResults()[scenario.path]) {
                        <span [class]="navigationResults()[scenario.path] === 'allowed' ? 'nav-allowed' : 'nav-blocked'">
                          {{ navigationResults()[scenario.path] === 'allowed' ? '✓ Allowed' : '✕ Blocked → /login' }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 5: Lazy Loading -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Lazy Loading — loadComponent & loadChildren</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet5" />
            <div class="demo-area">
              <p class="demo-label">Bundle splitting visualization</p>
              <div class="bundle-viz">
                <div class="bundle main-bundle">
                  <div class="bundle-label">main.js (~120kb)</div>
                  <div class="bundle-modules">
                    <span>AppComponent</span>
                    <span>HomeComponent</span>
                    <span>Router</span>
                    <span>Core Services</span>
                  </div>
                </div>
                <div class="bundle-separator">⚡ Loaded on demand</div>
                <div class="lazy-bundles">
                  @for (bundle of lazyBundles; track bundle.name) {
                    <div class="bundle lazy-bundle" [class.loaded]="loadedBundles().includes(bundle.name)" (click)="simulateLoad(bundle.name)">
                      <div class="bundle-label">{{ bundle.file }}</div>
                      <div class="bundle-size">{{ bundle.size }}</div>
                      <div class="bundle-status">
                        {{ loadedBundles().includes(bundle.name) ? '✓ Loaded' : 'Click to load' }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 6: Resolvers & Data Binding -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>Route Resolvers & Title Strategy</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet6" />
            <div class="demo-area">
              <p class="demo-label">Resolver simulation</p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
                @for (user of demoUsers; track user.id) {
                  <button class="btn btn--sm btn--secondary" (click)="simulateResolve(user.id)">
                    Resolve User {{ user.id }}
                  </button>
                }
              </div>
              @if (resolveState() === 'loading') {
                <div class="resolve-state resolve-state--loading">⏳ Fetching user data...</div>
              } @else if (resolveState() === 'done' && resolvedUser()) {
                <div class="resolve-state resolve-state--success">
                  ✓ Resolved: <strong>{{ resolvedUser()!.name }}</strong> ({{ resolvedUser()!.email }})
                  <br /><small>Page title set to: "User #{{ resolvedUser()!.id }}"</small>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Define a route config with nested child routes, a wildcard <code>**</code> route, and a redirect.</li>
          <li>Enable <code>withComponentInputBinding()</code> and bind a route param directly to a component <code>input()</code>.</li>
          <li>Write a functional <code>authGuard</code> that redirects to <code>/login</code> with a <code>returnUrl</code> query param.</li>
          <li>Lazy-load a feature module using <code>loadChildren</code> and verify it creates a separate JS chunk.</li>
          <li>Implement a functional resolver that fetches data and expose it as a signal using <code>toSignal()</code>.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .route-tree { display: flex; flex-direction: column; gap: 4px; }
    .route-node { display: flex; align-items: center; gap: 8px; padding: 7px 12px; background: var(--color-surface-3); border-radius: 6px; font-size: 0.85rem; }
    .route-icon { font-size: 0.9rem; }
    .route-badge { padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; &--guard { background: rgba(239,68,68,0.15); color: #f87171; } &--lazy { background: rgba(245,158,11,0.15); color: #fbbf24; } }
    .route-note { margin-left: auto; font-size: 0.75rem; color: var(--color-text-muted); }
    .mock-nav { display: flex; gap: 4px; background: var(--color-surface-3); border-radius: 10px; padding: 6px; flex-wrap: wrap; }
    .mock-nav__item { padding: 6px 14px; border-radius: 8px; text-decoration: none; color: var(--color-text-secondary); font-size: 0.85rem; font-weight: 500; transition: all 0.15s; &:hover { background: var(--color-surface); color: var(--color-text); } &--active { background: rgba(221,0,49,0.12); color: var(--color-primary-light); } }
    .param-demo { display: flex; flex-direction: column; gap: 1rem; }
    .user-detail-card { display: flex; align-items: center; gap: 1rem; background: var(--color-surface-3); border-radius: 10px; padding: 1rem; }
    .user-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.1rem; flex-shrink: 0; }
    .user-detail-card p { margin: 0; font-size: 0.82rem; color: var(--color-text-secondary); }
    .guard-demo { display: flex; flex-direction: column; gap: 0.75rem; }
    .auth-toggle { display: flex; align-items: center; gap: 0.75rem; }
    .routes-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .guard-route { display: flex; align-items: center; gap: 0.75rem; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; flex-wrap: wrap; }
    .guard-lock { color: #f87171; font-size: 0.75rem; }
    .nav-allowed { color: var(--color-success); font-weight: 600; font-size: 0.8rem; }
    .nav-blocked { color: var(--color-error); font-weight: 600; font-size: 0.8rem; }
    .bundle-viz { display: flex; flex-direction: column; gap: 0.75rem; }
    .bundle { background: var(--color-surface-3); border: 1px solid var(--color-border); border-radius: 10px; padding: 1rem; }
    .bundle-label { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem; }
    .main-bundle .bundle-modules { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .main-bundle .bundle-modules span { background: rgba(59,130,246,0.15); color: #60a5fa; border-radius: 6px; padding: 3px 10px; font-size: 0.75rem; }
    .bundle-separator { text-align: center; font-size: 0.8rem; color: var(--color-text-muted); }
    .lazy-bundles { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; }
    .lazy-bundle { cursor: pointer; transition: all 0.2s; text-align: center; &:hover { border-color: var(--color-primary); } &.loaded { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.05); } }
    .bundle-size { font-size: 0.75rem; color: var(--color-text-muted); }
    .bundle-status { font-size: 0.75rem; margin-top: 0.25rem; color: var(--color-success); }
    .resolve-state { padding: 12px 16px; border-radius: 8px; font-size: 0.9rem; &--loading { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); } &--success { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); small { color: var(--color-text-muted); display: block; margin-top: 0.25rem; font-size: 0.8rem; } } }
  `],
})
export class RoutingTopicComponent {
  readonly router = inject(Router);

  readonly routeTree = [
    { path: '', icon: '🏠', depth: 0, guard: null, lazy: false, note: 'HomeComponent' },
    { path: 'components', icon: '🧩', depth: 0, guard: null, lazy: false, note: null },
    { path: 'signals', icon: '⚡', depth: 0, guard: null, lazy: false, note: null },
    { path: 'admin', icon: '🔐', depth: 0, guard: 'adminGuard', lazy: true, note: 'Feature module' },
    { path: 'admin/users', icon: '👥', depth: 1, guard: null, lazy: false, note: null },
    { path: 'admin/settings', icon: '⚙️', depth: 1, guard: null, lazy: false, note: null },
    { path: '**', icon: '⚠️', depth: 0, guard: null, lazy: false, note: '404 Not Found' },
  ];

  readonly navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/components', label: 'Components', exact: false },
    { path: '/signals', label: 'Signals', exact: false },
    { path: '/forms', label: 'Forms', exact: false },
  ];

  readonly demoUsers = [
    { id: 1, name: 'Alice Kim', email: 'alice@example.com' },
    { id: 2, name: 'Bob Torres', email: 'bob@example.com' },
    { id: 3, name: 'Carol Wang', email: 'carol@example.com' },
  ];

  readonly selectedUserId = signal<number | null>(null);
  readonly selectedUser = computed(() =>
    this.demoUsers.find(u => u.id === this.selectedUserId()) ?? null
  );

  /* Guard demo */
  readonly isAuthenticated = signal(false);
  readonly navigationResults = signal<Record<string, 'allowed' | 'blocked'>>({});

  readonly guardScenarios: RouteScenario[] = [
    { label: 'Home', path: '', protected: false, requiresParam: false },
    { label: 'Profile', path: 'profile', protected: true, requiresParam: false },
    { label: 'Admin', path: 'admin', protected: true, requiresParam: false },
  ];

  tryNavigate(scenario: RouteScenario): void {
    const result = (!scenario.protected || this.isAuthenticated()) ? 'allowed' : 'blocked';
    this.navigationResults.update(r => ({ ...r, [scenario.path]: result }));
  }

  /* Lazy loading demo */
  readonly lazyBundles = [
    { name: 'admin', file: 'admin.js', size: '~48kb' },
    { name: 'settings', file: 'settings.js', size: '~22kb' },
    { name: 'reports', file: 'reports.js', size: '~65kb' },
    { name: 'dashboard', file: 'dashboard.js', size: '~31kb' },
  ];
  readonly loadedBundles = signal<string[]>([]);

  simulateLoad(name: string): void {
    if (!this.loadedBundles().includes(name)) {
      this.loadedBundles.update(b => [...b, name]);
    }
  }

  /* Resolver demo */
  readonly resolveState = signal<'idle' | 'loading' | 'done'>('idle');
  readonly resolvedUser = signal<{ id: number; name: string; email: string } | null>(null);

  simulateResolve(id: number): void {
    this.resolveState.set('loading');
    this.resolvedUser.set(null);
    setTimeout(() => {
      const user = this.demoUsers.find(u => u.id === id) ?? null;
      this.resolvedUser.set(user);
      this.resolveState.set('done');
    }, 800);
  }

  /* ── Code snippets ── */
  readonly codeSnippet1 = `// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },

  // Lazy-loaded feature route
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
                         .then(m => m.adminRoutes),
  },

  // Redirect
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // Wildcard
  { path: '**', component: NotFoundComponent },
];

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),   // inputs ← route params
      withViewTransitions(),         // View Transitions API
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
  ]
};`;
  readonly codeSnippet2 = `// Basic link
<a routerLink="/users">Users</a>

// With route params (array syntax)
<a [routerLink]="['/users', user.id]">{{ '{{' }} user.name {{ '}}' }}</a>

// With query params & fragment
<a
  routerLink="/products"
  [queryParams]="{ page: 2, sort: 'price' }"
  fragment="results"
>Products</a>

// Active class
<a routerLink="/dashboard"
   routerLinkActive="active"
   [routerLinkActiveOptions]="{ exact: true }"
>Dashboard</a>`;
  readonly codeSnippet3 = `// Route definition
{ path: 'products/:id', component: ProductDetailComponent }

// Option A: ActivatedRoute (traditional)
@Component({...})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // string | null
    });
  }
}

// Option B: withComponentInputBinding() — PREFERRED in Angular 16+
// Enable in providers: provideRouter(routes, withComponentInputBinding())
@Component({...})
export class ProductDetailComponent {
  // Route param 'id' maps directly to this input!
  readonly id = input<string>();
}`;
  readonly codeSnippet4 = `// Functional guard (Angular 15+) — preferred
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// canDeactivate — prevent unsaved changes
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> =
  (component) => {
    if (component.hasUnsavedChanges()) {
      return confirm('Leave? Unsaved changes will be lost.');
    }
    return true;
  };

// Route config
{
  path: 'settings',
  component: SettingsComponent,
  canActivate: [authGuard],
  canDeactivate: [unsavedChangesGuard],
}`;
  readonly codeSnippet5 = `// Lazy load a single component
{
  path: 'settings',
  loadComponent: () => import('./settings/settings.component')
                        .then(m => m.SettingsComponent),
}

// Lazy load a feature with child routes
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes')
                       .then(m => m.adminRoutes),
}

// admin.routes.ts (feature routes file)
export const adminRoutes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'settings', component: AdminSettingsComponent },
];`;
  readonly codeSnippet6 = `// Functional resolver (Angular 15+)
export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getById(+id).pipe(
    catchError(() => of(null)), // handle not-found gracefully
  );
};

// Route config
{
  path: 'users/:id',
  component: UserDetailComponent,
  resolve: { user: userResolver },
  title: (route) => 'User #' + route.params['id'],
}

// Component reads resolved data
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  readonly user = toSignal(
    this.route.data.pipe(map(d => d['user'] as User))
  );
}`;
}
