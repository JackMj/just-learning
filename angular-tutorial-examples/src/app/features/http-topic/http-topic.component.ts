import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
  resource,
  OnInit,
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import { JsonPipe, TitleCasePipe, SlicePipe } from '@angular/common';
import { of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';
import { AsyncState } from '../../core/models/tutorial.models';

/* ─── JSONPlaceholder types ──────────────────────────────── */
interface Post {
  readonly userId: number;
  readonly id: number;
  readonly title: string;
  readonly body: string;
}

interface Comment {
  readonly postId: number;
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly body: string;
}

interface Todo {
  readonly userId: number;
  readonly id: number;
  readonly title: string;
  readonly completed: boolean;
}

@Component({
  selector: 'app-http-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, TitleCasePipe, SlicePipe, CodeSnippetComponent],
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">🌐 Topic 7</p>
        <h1>HTTP & API Integration</h1>
        <p class="lead">
          Angular's <code>HttpClient</code> makes it easy to consume REST APIs with full
          TypeScript typing, interceptors, error handling, and the new <code>resource()</code> API.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li>Provide <code>HttpClient</code> via <code>provideHttpClient()</code> in <code>app.config.ts</code></li>
          <li>Always type your HTTP calls: <code>http.get&lt;Post[]&gt;(url)</code></li>
          <li>Use <code>catchError</code> and <code>retry</code> from RxJS for error resilience</li>
          <li><strong>Interceptors</strong> — add auth headers, log requests, handle 401 globally</li>
          <li><code>HttpParams</code> / <code>HttpHeaders</code> — build query strings and headers immutably</li>
          <li><code>resource()</code> — new Angular 19+ signal-based HTTP wrapper (no RxJS subscription needed)</li>
          <li>Avoid subscribing in components — prefer async pipe, <code>toSignal()</code>, or <code>resource()</code></li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: GET request -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Basic GET Request with HttpClient</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — fetch posts from JSONPlaceholder</p>
              <button class="btn btn--primary btn--sm" [disabled]="postsState().status === 'loading'" (click)="loadPosts()">
                {{ postsState().status === 'loading' ? '⏳ Loading...' : 'Fetch Posts' }}
              </button>
              @switch (postsState().status) {
                @case ('loading') {
                  <div class="loading-skeleton">
                    @for (i of [1,2,3]; track i) {
                      <div class="skeleton-item">
                        <div class="skeleton skeleton--title"></div>
                        <div class="skeleton skeleton--text"></div>
                      </div>
                    }
                  </div>
                }
                @case ('success') {
                  <div class="posts-list">
                    @for (post of postsState().data ?? []; track post.id) {
                      <div class="post-card">
                        <span class="post-id">#{{ post.id }}</span>
                        <div>
                          <h4>{{ post.title | titlecase }}</h4>
                          <p>{{ post.body | slice:0:80 }}...</p>
                        </div>
                      </div>
                    }
                  </div>
                }
                @case ('error') {
                  <div class="error-display">⚠ {{ postsState().error }}</div>
                }
              }
            </div>
          </div>
        </div>

        <!-- Example 2: POST / PUT / DELETE -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>POST, PATCH & DELETE Requests</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — CRUD operations</p>
              <div class="crud-form" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; max-width: 400px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <input type="text" [value]="newPostTitle()" (input)="newPostTitle.set($any($event.target).value)" placeholder="Post title" />
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <textarea [value]="newPostBody()" (input)="newPostBody.set($any($event.target).value)" placeholder="Post body" rows="2"></textarea>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button class="btn btn--primary btn--sm" [disabled]="!newPostTitle()" (click)="createPost()">POST Create</button>
                  <button class="btn btn--accent btn--sm" (click)="patchPost()">PATCH Update #1</button>
                  <button class="btn btn--secondary btn--sm" (click)="deletePost()">DELETE #1</button>
                </div>
              </div>
              @if (crudResult()) {
                <div class="result-display">
                  <pre style="margin: 0; font-size: 0.8rem;">{{ crudResult() | json }}</pre>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 3: HttpParams & Headers -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>HttpParams & HttpHeaders — Immutable Builders</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — paginated API call</p>
              <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.75rem;">
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem;">userId filter:</label>
                  <select (change)="paramUserId.set(+$any($event.target).value)" style="padding: 6px 10px; font-size: 0.8rem;">
                    @for (uid of [1,2,3,4,5]; track uid) {
                      <option [value]="uid">User {{ uid }}</option>
                    }
                  </select>
                </div>
                <div class="form-group" style="margin: 0;">
                  <label style="font-size: 0.8rem;">limit:</label>
                  <select (change)="paramLimit.set(+$any($event.target).value)" style="padding: 6px 10px; font-size: 0.8rem;">
                    @for (l of [3,5,10]; track l) {
                      <option [value]="l">{{ l }}</option>
                    }
                  </select>
                </div>
                <button class="btn btn--primary btn--sm" (click)="fetchWithParams()">Fetch with params</button>
              </div>
              <code style="font-size: 0.75rem; display: block; margin-bottom: 0.75rem;">
                GET /posts?userId={{ paramUserId() }}&_limit={{ paramLimit() }}
              </code>
              @if (paramPosts().length > 0) {
                <ul class="item-list" style="font-size: 0.85rem;">
                  @for (post of paramPosts(); track post.id) {
                    <li>{{ post.title | slice:0:60 }}</li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>

        <!-- Example 4: Interceptors -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>HTTP Interceptors — Functional Style</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet4" />
            <div class="demo-area">
              <p class="demo-label">Interceptor chain visualization</p>
              <div class="interceptor-chain">
                <div class="chain-step">
                  <span class="chain-label">Component</span>
                  <code>http.get('/api/data')</code>
                </div>
                @for (interceptor of interceptors; track interceptor.name) {
                  <div class="chain-arrow">→</div>
                  <div class="chain-step chain-step--interceptor" [class.chain-step--active]="simulatingRequest()">
                    <span class="chain-label">{{ interceptor.name }}</span>
                    <code>{{ interceptor.action }}</code>
                  </div>
                }
                <div class="chain-arrow">→</div>
                <div class="chain-step chain-step--server">
                  <span class="chain-label">Server</span>
                  <code>API Response</code>
                </div>
              </div>
              <button class="btn btn--sm btn--primary" style="margin-top: 0.75rem;" (click)="simulateInterceptors()">
                {{ simulatingRequest() ? '⏳ Processing...' : 'Simulate Request' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Example 5: resource() API -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>resource() — Signal-Based HTTP (Angular 19+)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet5" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — resource() API</p>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                <span style="font-size: 0.85rem; color: var(--color-text-secondary);">Select user:</span>
                @for (uid of [1,2,3,4,5]; track uid) {
                  <button
                    class="btn btn--sm"
                    [class.btn--primary]="resourceUserId() === uid"
                    [class.btn--secondary]="resourceUserId() !== uid"
                    (click)="resourceUserId.set(uid)"
                  >User {{ uid }}</button>
                }
              </div>
              @if (todosResource.isLoading()) {
                <div class="loading-bar"><div class="loading-progress"></div></div>
              }
              @if (todosResource.error()) {
                <div class="error-display">Error loading todos</div>
              }
              @if (todoItems().length > 0) {
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">
                  @for (todo of todoItems(); track todo.id) {
                    <li class="todo-item" [class.todo-item--done]="todo.completed">
                      <span class="todo-check">{{ todo.completed ? '✓' : '○' }}</span>
                      <span>{{ todo.title }}</span>
                    </li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Create a <code>PostsService</code> that wraps all CRUD operations for the JSONPlaceholder API with typed methods.</li>
          <li>Write a functional interceptor that adds a UUID <code>X-Request-ID</code> header to every outgoing request.</li>
          <li>Build a <code>SearchComponent</code> that debounces user input (300ms) and fetches results from an API.</li>
          <li>Use <code>resource()</code> to create a reactive user profile that re-fetches when a route param signal changes.</li>
          <li>Implement retry logic with exponential backoff using RxJS <code>retryWhen</code> and <code>delay</code>.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .posts-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
    .post-card { display: flex; gap: 1rem; align-items: flex-start; padding: 10px 12px; background: var(--color-surface-3); border-radius: 8px; }
    .post-id { font-family: 'Fira Code', monospace; color: var(--color-primary-light); font-size: 0.8rem; min-width: 28px; padding-top: 2px; }
    .post-card h4 { margin: 0 0 4px; font-size: 0.9rem; text-transform: capitalize; }
    .post-card p { margin: 0; font-size: 0.8rem; color: var(--color-text-secondary); }
    .error-display { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; border-radius: 8px; padding: 12px; font-size: 0.9rem; margin-top: 0.75rem; }
    .loading-skeleton { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
    .skeleton-item { background: var(--color-surface-3); border-radius: 8px; padding: 12px; }
    .skeleton { background: var(--color-surface); border-radius: 4px; animation: shimmer 1.5s infinite; height: 14px; margin-bottom: 8px; &--title { width: 60%; height: 16px; } &--text { width: 90%; } }
    @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
    .interceptor-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .chain-step { background: var(--color-surface-3); border: 1px solid var(--color-border); border-radius: 8px; padding: 8px 12px; min-width: 120px; text-align: center; }
    .chain-step--interceptor { border-color: rgba(245,158,11,0.3); &.chain-step--active { border-color: rgba(245,158,11,0.8); box-shadow: 0 0 8px rgba(245,158,11,0.3); } }
    .chain-step--server { border-color: rgba(34,197,94,0.3); }
    .chain-label { display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-text-muted); margin-bottom: 4px; }
    .chain-step code { font-size: 0.72rem; }
    .chain-arrow { color: var(--color-primary); font-size: 1.2rem; }
    .loading-bar { height: 4px; background: var(--color-surface-3); border-radius: 2px; overflow: hidden; margin-bottom: 0.5rem; }
    .loading-progress { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light)); border-radius: 2px; animation: loading 1.5s infinite; }
    @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
    .todo-item { display: flex; align-items: center; gap: 0.75rem; padding: 8px 12px; background: var(--color-surface-3); border-radius: 8px; font-size: 0.85rem; &--done { opacity: 0.55; span:last-child { text-decoration: line-through; } } }
    .todo-check { color: var(--color-success); font-family: 'Fira Code', monospace; font-size: 0.9rem; }
  `],
})
export class HttpTopicComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly notif = inject(NotificationService);

  /* Ex 1 — GET */
  readonly postsState = signal<AsyncState<Post[]>>({ data: null, status: 'idle', error: null });

  loadPosts(): void {
    this.postsState.update(s => ({ ...s, status: 'loading', error: null }));
    this.http
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(
        map(posts => posts.slice(0, 5)),
        retry(2),
        catchError((err: HttpErrorResponse) => {
          this.postsState.update(s => ({ ...s, status: 'error', error: err.message }));
          return of([]);
        }),
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.postsState.set({ data, status: 'success', error: null });
        }
      });
  }

  /* Ex 2 — CRUD */
  readonly newPostTitle = signal('');
  readonly newPostBody = signal('My post body content');
  readonly crudResult = signal<Record<string, unknown> | null>(null);

  createPost(): void {
    this.http.post<Post>('https://jsonplaceholder.typicode.com/posts', {
      title: this.newPostTitle(),
      body: this.newPostBody(),
      userId: 1,
    }).subscribe(result => {
      this.crudResult.set(result as unknown as Record<string, unknown>);
      this.notif.success(`Created post #${result.id}: "${result.title}"`);
    });
  }

  patchPost(): void {
    this.http.patch<Post>('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'Patched title via PATCH',
    }).subscribe(result => {
      this.crudResult.set(result as unknown as Record<string, unknown>);
      this.notif.info('Post patched');
    });
  }

  deletePost(): void {
    this.http.delete('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe(() => {
        this.crudResult.set({ deleted: true, id: 1 });
        this.notif.warning('Post #1 deleted (simulated)');
      });
  }

  /* Ex 3 — HttpParams */
  readonly paramUserId = signal(1);
  readonly paramLimit = signal(3);
  readonly paramPosts = signal<Post[]>([]);

  fetchWithParams(): void {
    const params = new HttpParams()
      .set('userId', String(this.paramUserId()))
      .set('_limit', String(this.paramLimit()));

    this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params })
      .subscribe(posts => this.paramPosts.set(posts));
  }

  /* Ex 4 — Interceptors */
  readonly interceptors = [
    { name: 'Auth Interceptor', action: 'add Bearer token' },
    { name: 'Loading Interceptor', action: 'show spinner' },
    { name: 'Error Interceptor', action: 'handle 401/500' },
  ];
  readonly simulatingRequest = signal(false);

  simulateInterceptors(): void {
    this.simulatingRequest.set(true);
    setTimeout(() => this.simulatingRequest.set(false), 1500);
  }

  /* Ex 5 — resource() */
  readonly resourceUserId = signal(1);

  readonly todosResource = resource<Todo[], number>({
    params: () => this.resourceUserId(),
    loader: async ({ params: userId }) => {
      const url = `https://jsonplaceholder.typicode.com/todos?userId=${userId}&_limit=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Todo[]>;
    },
  });

  readonly todoItems = computed((): Todo[] => this.todosResource.value() ?? []);

  ngOnInit(): void {
    // Auto-load posts on init
    this.loadPosts();
  }

  /* ── Code snippets ── */
  readonly codeSnippet1 = `// app.config.ts — provide HttpClient
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),  // uses Fetch API instead of XHR
  ]
};

// Component
private readonly http = inject(HttpClient);

loadPosts(): void {
  this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')
    .pipe(
      map(posts => posts.slice(0, 5)),
      catchError(err => {
        console.error(err);
        return of([]);  // fallback to empty
      }),
    )
    .subscribe(posts => this.posts.set(posts));
}`;
  readonly codeSnippet2 = `// POST — create resource
http.post<Post>('/api/posts', {
  title: 'New Post',
  body: 'Content here',
  userId: 1
}, {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}).subscribe(created => console.log(created));

// PATCH — partial update
http.patch<Post>('/api/posts/' + id, { title: 'Updated title' })
  .subscribe(updated => ...);

// DELETE
http.delete('/api/posts/' + id)
  .subscribe(() => removeFromList(id));`;
  readonly codeSnippet3 = `// HttpParams — builds query string immutably
const params = new HttpParams()
  .set('page', '2')
  .set('limit', '10')
  .set('sort', 'createdAt');
// → ?page=2&limit=10&sort=createdAt

// HttpHeaders
const headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + token)
  .set('X-Request-ID', uuid());

// Using both
http.get<ApiResponse>('/api/users', { params, headers });

// Shorthand object form (string values only)
http.get('/api/users', {
  params: { page: '1', limit: '20' },
  headers: { Authorization: 'Bearer token123' },
});`;
  readonly codeSnippet4 = `// Functional interceptor (Angular 15+) — preferred
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Clone request — HttpRequest is immutable
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
    : req;

  return next(authReq);
};

// Loading indicator interceptor
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};

// Provide in app.config.ts
provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor]))`;
  readonly codeSnippet5 = `// resource() — declarative HTTP with signals (no subscribe needed!)
readonly selectedUserId = signal(1);

readonly userTodos = resource({
  // Re-fetches automatically when selectedUserId() changes
  params: () => this.selectedUserId(),

  loader: async ({ params: userId }) => {
    const url = '/todos?userId=' + userId + '&_limit=5';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json() as Promise<Todo[]>;
  },
});

// Access in template — automatically typed
userTodos.value()        // Todo[] | undefined
userTodos.isLoading()    // boolean
{{ '{{' }} userTodos.error() {{ '}}' }}       // unknown | undefined`;
}
