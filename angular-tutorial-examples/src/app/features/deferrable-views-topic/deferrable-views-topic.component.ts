import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';

/* ─── Heavy Content Components (simulating lazy-loaded) ───── */
@Component({
  selector: 'app-heavy-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './heavy-chart.component.html',
  styleUrl: './heavy-chart.component.scss',
})
export class HeavyChartComponent {
  readonly bars = [
    { label: 'Jan', value: 45, color: '#dd0031' },
    { label: 'Feb', value: 62, color: '#c3002f' },
    { label: 'Mar', value: 38, color: '#ff4f6a' },
    { label: 'Apr', value: 71, color: '#dd0031' },
    { label: 'May', value: 53, color: '#c3002f' },
    { label: 'Jun', value: 89, color: '#ff4f6a' },
  ];
}

@Component({
  selector: 'app-heavy-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './heavy-table.component.html',
  styleUrl: './heavy-table.component.scss',
})
export class HeavyTableComponent {
  readonly rows = [
    { id: 1, name: 'Alice Chen', score: 95, status: 'active' },
    { id: 2, name: 'Bob Torres', score: 72, status: 'pending' },
    { id: 3, name: 'Carol Wang', score: 88, status: 'active' },
    { id: 4, name: 'Dave Kim', score: 61, status: 'inactive' },
    { id: 5, name: 'Eve Patel', score: 79, status: 'active' },
  ];
}

/* ─── Main Topic Component ──────────────────────────────── */
@Component({
  selector: 'app-deferrable-views-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeavyChartComponent, HeavyTableComponent, CodeSnippetComponent],
  templateUrl: './deferrable-views-topic.component.html',
  styleUrl: './deferrable-views-topic.component.scss',
})
export class DeferrableViewsTopicComponent {
  readonly conditionMet = signal(false);

  /* ── Code snippets ── */
  readonly codeSnippet1 = `@defer {
  <app-heavy-chart />        <!-- loaded lazily -->
} @placeholder {
  <div class="placeholder">Chart loading...</div>
} @loading (minimum 300ms) {
  <div class="spinner">⏳</div>
} @error {
  <div class="error">Failed to load chart</div>
}`;
  readonly codeSnippet2 = `// Loads when user clicks the button reference
<button #loadBtn>Load Data Table</button>

@defer (on interaction(loadBtn)) {
  <app-heavy-table />
} @placeholder {
  <p>Click the button above to load the table.</p>
}`;
  readonly codeSnippet3 = `// Loads when user hovers over the trigger element
@defer (on hover(hoverTrigger)) {
  <app-user-preview />
} @placeholder {
  <div #hoverTrigger class="hover-zone">
    Hover here to load preview...
  </div>
}`;
  readonly codeSnippet4 = `// Loads when expression becomes truthy
@defer (when isLoggedIn()) {
  <app-dashboard />
} @placeholder {
  <app-login-prompt />
}

// Combine with prefetch
@defer (
  when showChart();
  prefetch on idle      <!-- prefetch JS on idle, show when condition met -->
) {
  <app-chart />
}`;
  readonly codeSnippet5 = `// Loads when placeholder enters the viewport
// Uses IntersectionObserver under the hood — no polyfill needed

@defer (on viewport) {
  <app-analytics-dashboard />   <!-- loads when scrolled into view -->
} @placeholder (minimum 0ms) {
  <div class="viewport-placeholder">
    Scroll down to load this section...
  </div>
}

// Best practice: Use on viewport for below-the-fold content
// Use on idle for non-critical background content
// Use on interaction for user-initiated content
// Use when for content behind auth/feature flags`;
}
