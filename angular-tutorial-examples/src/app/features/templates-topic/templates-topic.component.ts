import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  NgClass,
  DatePipe,
  CurrencyPipe,
  UpperCasePipe,


} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';

/* ─── Custom Pipes ──────────────────────────────────── */
@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 50, suffix = '...'): string {
    if (!value) return '';
    return value.length > maxLength ? value.slice(0, maxLength) + suffix : value;
  }
}

/* ─── Helper types ──────────────────────────────────── */
interface Employee {
  readonly id: number;
  name: string;
  department: string;
  salary: number;
  startDate: Date;
  active: boolean;
}

@Component({
  selector: 'app-templates-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    DatePipe,
    CurrencyPipe,
    UpperCasePipe,
  
  
    FormsModule,
    TruncatePipe,
    CodeSnippetComponent,
  ],
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">&#x1F4C4; Topic 2</p>
        <h1>Templates</h1>
        <p class="lead">
          Angular templates are HTML with superpowers. They support interpolation,
          property/event binding, control flow, and pipes.
        </p>
      </header>

      <div class="theory-box">
        <h4>&#x1F4D6; Theory</h4>
        <ul>
          <li><strong>Interpolation</strong> <code>{{ '{{' }} expr {{ '}}' }}</code> — renders dynamic text</li>
          <li><strong>Property binding</strong> <code>[prop]="expr"</code> — sets DOM properties</li>
          <li><strong>Event binding</strong> <code>(event)="handler()"</code> — responds to DOM events</li>
          <li><strong>Two-way binding</strong> <code>[(ngModel)]="prop"</code> — syncs input &#8596; model</li>
          <li><strong>Control flow</strong> — <code>&#64;if</code>, <code>&#64;for</code>, <code>&#64;switch</code> (Angular 17+)</li>
          <li><strong>Pipes</strong> — transform display values inline, e.g. <code>| date</code>, <code>| currency</code></li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: Interpolation & Property Binding -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Interpolation &amp; Property Binding</h3>
          </div>
          <div class="example-container__body">
            <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              Interpolation renders expressions as text. Property binding sets element properties.
            </p>
            <app-code [code]="codeInterpolation" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div class="binding-demo">
                <div class="user-card-demo">
                  <div class="avatar" [style.background-color]="avatarColor()">
                    {{ userName().charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4>{{ userName() }}</h4>
                    <p style="font-size: 0.82rem; margin:0;">Score: {{ score() }} / 100</p>
                  </div>
                </div>
                <div class="controls" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div class="form-group">
                    <label>Name:</label>
                    <input type="text" [value]="userName()" (input)="userName.set($any($event.target).value)" />
                  </div>
                  <div class="form-group">
                    <label>Score (0-100): {{ score() }}</label>
                    <input type="range" min="0" max="100" [value]="score()" (input)="score.set(+$any($event.target).value)" />
                  </div>
                  <div>
                    <span>Status: </span>
                    <span [class]="score() >= 60 ? 'pass' : 'fail'">
                      {{ score() >= 60 ? '&#x2713; Pass' : '&#x2715; Fail' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 2: Event Binding -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>Event Binding &amp; Two-Way Binding</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeEvents" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div class="form-group">
                <label>Two-way binding with [(ngModel)]:</label>
                <input type="text" [(ngModel)]="twoWayValue" placeholder="Type something..." />
              </div>
              <div class="result-display">
                Bound value: <strong>{{ twoWayValue }}</strong>
                &nbsp;|&nbsp; Length: <strong>{{ twoWayValue.length }}</strong>
              </div>
              <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                @for (event of clickEvents(); track $index) {
                  <span class="event-chip">{{ event }}</span>
                }
              </div>
              <button class="btn btn--accent btn--sm" style="margin-top: 0.5rem;" (click)="addClickEvent()">
                Click Me ({{ clickEvents().length }})
              </button>
            </div>
          </div>
        </div>

        <!-- Example 3: Control Flow -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>Control Flow: &#64;if, &#64;for, &#64;switch</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeControlFlow" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <button class="btn btn--sm btn--secondary" (click)="cfRole.set('admin')">Admin</button>
                <button class="btn btn--sm btn--secondary" (click)="cfRole.set('editor')">Editor</button>
                <button class="btn btn--sm btn--secondary" (click)="cfRole.set('viewer')">Viewer</button>
              </div>
              <div class="role-panel">
                @if (cfRole() === 'admin') {
                  <div class="role-block role-block--admin">&#x1F510; Admin Panel — full access granted</div>
                } @else if (cfRole() === 'editor') {
                  <div class="role-block role-block--editor">&#x270F;&#xFE0F; Editor Panel — create &amp; edit content</div>
                } @else {
                  <div class="role-block role-block--viewer">&#x1F441;&#xFE0F; Viewer Panel — read-only access</div>
                }
              </div>

              <div style="margin-top: 1.25rem;">
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                  &#64;for with &#64;empty:
                </p>
                <ul class="item-list">
                  @for (emp of visibleEmployees(); track emp.id) {
                    <li>
                      <strong>{{ emp.name }}</strong>
                      &nbsp;— {{ emp.department }}
                    </li>
                  } @empty {
                    <li style="color: var(--color-text-muted);">No employees found.</li>
                  }
                </ul>
                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                  <button class="btn btn--sm btn--secondary" (click)="toggleEmployees()">
                    {{ showEmployees() ? 'Clear' : 'Show' }} Employees
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 4: Pipes -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>Built-in &amp; Custom Pipes</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codePipes" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Start Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (emp of employees; track emp.id) {
                    <tr [class.row--inactive]="!emp.active">
                      <td>{{ emp.name | uppercase }}</td>
                      <td>{{ emp.department }}</td>
                      <td>{{ emp.salary | currency:'USD':'symbol':'1.0-0' }}</td>
                      <td>{{ emp.startDate | date:'mediumDate' }}</td>
                      <td>
                        <span [class]="emp.active ? 'status-active' : 'status-inactive'">
                          {{ emp.active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <div style="margin-top: 0.75rem;">
                <p style="font-size: 0.8rem; color: var(--color-text-secondary);">Custom truncate pipe:</p>
                <p style="font-size: 0.9rem;">{{ longText | truncate:60 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 5: Template Variables -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Template Reference Variables</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeTemplateVars" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <input #searchRef type="text" placeholder="Type to filter employees..." style="flex:1;" />
                <button class="btn btn--accent btn--sm" (click)="filterEmployees(searchRef.value)">
                  Search
                </button>
              </div>
              <ul class="item-list">
                @for (emp of filteredEmployees(); track emp.id) {
                  <li>
                    <strong>{{ emp.name }}</strong> — {{ emp.department }}
                  </li>
                } @empty {
                  <li style="color: var(--color-text-muted);">No match.</li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- Example 6: Class & Style Bindings -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>Dynamic Class &amp; Style Bindings</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeClassStyle" />
            <div class="demo-area">
              <p class="demo-label">Live Demo</p>
              <div class="style-controls">
                <div class="form-group">
                  <label>Text Color:</label>
                  <input type="color" [value]="styleColor()" (input)="styleColor.set($any($event.target).value)" style="width: auto; padding: 4px;" />
                </div>
                <div class="form-group">
                  <label>Font Size: {{ styleFontSize() }}px</label>
                  <input type="range" min="12" max="36" [value]="styleFontSize()" (input)="styleFontSize.set(+$any($event.target).value)" />
                </div>
                <div class="form-group" style="flex-direction: row; align-items: center;">
                  <label>Bold:</label>
                  <input type="checkbox" [checked]="styleBold()" (change)="styleBold.set($any($event.target).checked)" style="width: auto;" />
                </div>
              </div>
              <div
                class="style-preview"
                [style.color]="styleColor()"
                [style.font-size.px]="styleFontSize()"
                [style.font-weight]="styleBold() ? '700' : '400'"
                [ngClass]="{ 'style-preview--bold': styleBold() }"
              >
                Hello, Angular Developers! &#x1F680;
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>&#x1F3CB;&#xFE0F; Exercises</h4>
        <ol>
          <li>Create a <code>ColorPicker</code> component that uses two-way binding to update a live color preview.</li>
          <li>Build a filterable list using <code>&#64;for</code>, <code>&#64;empty</code>, and a search input with event binding.</li>
          <li>Implement a <code>RoleSwitcher</code> using <code>&#64;switch</code> to show different panels per role.</li>
          <li>Write a custom <code>RelativeTimePipe</code> that converts dates to "2 hours ago" style strings.</li>
          <li>Create a progress bar component with dynamic width using style binding <code>[style.width.%]</code>.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .binding-demo { display: flex; flex-direction: column; gap: 1rem; }
    .user-card-demo { display: flex; align-items: center; gap: 1rem; background: var(--color-surface-3); border-radius: 10px; padding: 1rem; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; color: white; flex-shrink: 0; }
    .pass { color: var(--color-success); font-weight: 600; }
    .fail { color: var(--color-error); font-weight: 600; }
    .event-chip { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; border-radius: 20px; padding: 2px 10px; font-size: 0.75rem; }
    .role-panel { }
    .role-block { padding: 12px 16px; border-radius: 10px; font-weight: 500; font-size: 0.9rem; }
    .role-block--admin { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }
    .role-block--editor { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; }
    .role-block--viewer { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .data-table th { text-align: left; padding: 8px 10px; color: var(--color-text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--color-border); }
    .data-table td { padding: 8px 10px; border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); }
    .data-table tr:hover td { background: var(--color-surface-3); }
    .row--inactive td { opacity: 0.5; }
    .status-active { color: var(--color-success); font-weight: 500; }
    .status-inactive { color: var(--color-text-muted); }
    .style-controls { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
    .style-preview { padding: 1.5rem; background: var(--color-surface-3); border-radius: 10px; transition: all 0.2s; }
  `],
})
export class TemplatesTopicComponent {
  /* Ex 1 */
  readonly userName = signal('Alex Chen');
  readonly score = signal(72);
  readonly avatarColor = computed(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];
    return colors[this.userName().charCodeAt(0) % colors.length];
  });

  /* Ex 2 — two-way with regular property for ngModel */
  twoWayValue = '';
  readonly clickEvents = signal<string[]>([]);
  addClickEvent(): void {
    const ts = new Date().toLocaleTimeString();
    this.clickEvents.update(e => [...e.slice(-4), `click @ ${ts}`]);
  }

  /* Ex 3 */
  readonly cfRole = signal<'admin' | 'editor' | 'viewer'>('admin');
  readonly showEmployees = signal(true);

  readonly employees: Employee[] = [
    { id: 1, name: 'Sarah Johnson', department: 'Engineering', salary: 120000, startDate: new Date('2020-03-15'), active: true },
    { id: 2, name: 'Marcus Rivera', department: 'Design', salary: 95000, startDate: new Date('2021-07-01'), active: true },
    { id: 3, name: 'Yuki Tanaka', department: 'Product', salary: 110000, startDate: new Date('2019-11-20'), active: false },
    { id: 4, name: 'Emily Watson', department: 'Engineering', salary: 130000, startDate: new Date('2022-01-10'), active: true },
  ];

  readonly visibleEmployees = computed(() =>
    this.showEmployees() ? this.employees : []
  );

  toggleEmployees(): void {
    this.showEmployees.update(v => !v);
  }

  /* Ex 5 */
  readonly filteredEmployees = signal<Employee[]>(this.employees);
  filterEmployees(query: string): void {
    const q = query.toLowerCase();
    this.filteredEmployees.set(
      q ? this.employees.filter(e => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) : this.employees
    );
  }

  readonly longText = 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript.';

  /* Ex 6 */
  readonly styleColor = signal('#dd0031');
  readonly styleFontSize = signal(18);
  readonly styleBold = signal(false);

  /* Code snippets */
  readonly codeInterpolation = `// Interpolation
<h1>Hello, {{ user.name }}!</h1>
<p>{{ 1 + 1 }} = 2</p>

// Property binding
<img [src]="avatarUrl" [alt]="user.name">
<button [disabled]="isLoading">Submit</button>
<div [class.active]="isActive" [style.color]="textColor">`;

  readonly codeEvents = `// Event binding
<button (click)="handleClick()">Click me</button>
<input (keyup.enter)="onEnter()">
<form (ngSubmit)="onSubmit($event)">

// Two-way with ngModel
<input [(ngModel)]="searchTerm">
<p>You typed: {{ searchTerm }}</p>`;

  readonly codeControlFlow = `// @if / @else if / @else
@if (user.role === 'admin') {
  <AdminPanel />
} @else if (user.role === 'editor') {
  <EditorPanel />
} @else {
  <ViewerPanel />
}

// @for with track
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items found.</li>
}

// @switch
@switch (status) {
  @case ('loading') { <Spinner /> }
  @case ('error') { <ErrorView /> }
  @default { <Content /> }
}`;

  readonly codePipes = `// Built-in pipes
{{ employee.salary | currency:'USD':'symbol':'1.0-0' }}
{{ employee.startDate | date:'mediumDate' }}
{{ employee.name | uppercase }}

// Custom pure pipe
@Pipe({ name: 'truncate', pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength = 50): string {
    return value.length > maxLength
      ? value.slice(0, maxLength) + '...'
      : value;
  }
}`;

  readonly codeTemplateVars = `// Template reference variable
<input #searchInput type="text" />
<button (click)="doSearch(searchInput.value)">Search</button>

// Access child component
<app-child #childRef />
<button (click)="childRef.doSomething()">Call Child</button>

// viewChild (programmatic access)
readonly inputRef = viewChild<ElementRef>('searchInput');`;

  readonly codeClassStyle = `// Single class toggle
<div [class.active]="isActive">

// Object syntax (ngClass)
<div [ngClass]="{ active: isActive, error: hasError }">

// Style binding
<div [style.color]="textColor">
<div [style.font-size.px]="fontSize">

// Multiple styles
<div [style]="{ color: textColor, fontSize: fontSize + 'px' }">`;
}
