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
  templateUrl: './templates-topic.component.html',
  styleUrl: './templates-topic.component.scss',
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
