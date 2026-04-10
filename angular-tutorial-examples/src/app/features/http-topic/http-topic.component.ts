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
  templateUrl: './http-topic.component.html',
  styleUrl: './http-topic.component.scss',
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
