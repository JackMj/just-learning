# Angular Tutorial Examples

A comprehensive Angular tutorial application covering all major topics from [angular.dev/tutorials](https://angular.dev/tutorials/). Built with Angular 21, TypeScript 5.9, and modern best practices.

## Features

- **8 complete topic modules** with theory, live examples, and exercises
- **5-6 examples per topic** with interactive demos
- **TypeScript strict mode** throughout
- **Signal-based reactivity** using Angular 17+ APIs (`signal()`, `computed()`, `effect()`, `input()`, `model()`, `resource()`)
- **Standalone components** — no NgModules
- **`ChangeDetectionStrategy.OnPush`** on every component
- **Lazy-loaded routes** via `loadComponent`
- **Modern control flow** — `@if`, `@for`, `@switch`, `@defer`
- **Functional DI** via `inject()`

## Topics Covered

| # | Topic | Key Concepts | Examples |
|---|-------|--------------|----------|
| 1 | **Components** | Anatomy, `input()`/`output()`, lifecycle hooks, OnPush, content projection, host bindings | 6 |
| 2 | **Templates** | Interpolation, event binding, two-way binding, control flow, pipes, template vars | 6 |
| 3 | **Signals** | `signal()`, `computed()`, `effect()`, `input()`, `model()`, service state | 6 |
| 4 | **Services & DI** | `inject()`, `Injectable`, `InjectionToken`, providers, hierarchical DI | 6 |
| 5 | **Routing** | Route definition, `RouterLink`, params, guards, lazy loading, resolvers | 6 |
| 6 | **Forms** | Template-driven, reactive, custom validators, `FormArray`, typed forms | 6 |
| 7 | **HTTP & API** | `HttpClient`, interceptors, `HttpParams`, `resource()` API, error handling | 5 |
| 8 | **Deferrable Views** | `@defer`, triggers (viewport, hover, interaction, when), `@loading`, `@placeholder` | 5 |

## Getting Started

```bash
# Install dependencies
cd angular-tutorial-examples
npm install

# Start dev server
npm start
# → http://localhost:4200

# Build for production
npm run build
```

## Project Structure

```
src/app/
├── core/
│   ├── models/        # TypeScript interfaces & domain types
│   └── services/      # Shared injectable services (TaskService, ProductService, etc.)
├── shared/
│   └── components/    # Reusable components (Sidebar, Toast, CodeSnippet)
└── features/
    ├── home/                    # Landing page
    ├── components-topic/        # Topic 1
    ├── templates-topic/         # Topic 2
    ├── signals-topic/           # Topic 3
    ├── services-topic/          # Topic 4
    ├── routing-topic/           # Topic 5
    ├── forms-topic/             # Topic 6
    ├── http-topic/              # Topic 7
    └── deferrable-views-topic/  # Topic 8
```

## TypeScript Best Practices Used

- **Strict mode** — `strict: true` in tsconfig
- **Explicit return types** on methods
- **`readonly`** on properties that shouldn't be mutated
- **Discriminated unions** for state types (`LoadingState`, `UserRole`, etc.)
- **Type parameters** on generic signals: `signal<Post[]>([])`
- **`input.required<T>()`** instead of `@Input()` with no default
- **`const` assertions** for immutable data arrays
- **`as const`** on literal types
- **`noImplicitAny`** — no implicit `any` types

## Angular Best Practices Used

- **`ChangeDetectionStrategy.OnPush`** on all components
- **Standalone components** — no NgModules required
- **Signal-based inputs** — `input()` / `input.required()` instead of `@Input()`
- **Signal-based outputs** — `output()` instead of `@Output()` + `EventEmitter`
- **`model()`** for two-way bindable signal components
- **`inject()`** over constructor injection
- **`InjectionToken<T>`** for typed config tokens
- **Functional route guards** (`CanActivateFn`, `CanDeactivateFn`)
- **Functional HTTP interceptors** (`HttpInterceptorFn`)
- **`loadComponent`** for lazy-loaded routes
- **`withComponentInputBinding()`** to bind route params to inputs
- **`@defer`** for lazy rendering of below-the-fold content
- **`asReadonly()`** to expose signals without write access

## Tech Stack

- **Angular** 21.2
- **TypeScript** 5.9
- **RxJS** 7.8
- **SCSS** with CSS custom properties
- **Vite** (via Angular Builder)
