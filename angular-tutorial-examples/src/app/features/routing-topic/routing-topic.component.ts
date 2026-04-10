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
  templateUrl: './routing-topic.component.html',
  styleUrl: './routing-topic.component.scss',
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
