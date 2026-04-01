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
  template: `
    <div class="chart-demo">
      <div class="chart-header">📊 Interactive Chart (heavy component)</div>
      <div class="chart-bars">
        @for (bar of bars; track bar.label) {
          <div class="chart-bar-container">
            <div class="chart-bar" [style.height.px]="bar.value * 2" [style.background]="bar.color"></div>
            <span class="bar-label">{{ bar.label }}</span>
            <span class="bar-value">{{ bar.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .chart-demo { background: var(--color-surface-3); border-radius: 10px; padding: 1.25rem; }
    .chart-header { font-weight: 600; margin-bottom: 1rem; font-size: 0.9rem; }
    .chart-bars { display: flex; align-items: flex-end; gap: 12px; height: 140px; }
    .chart-bar-container { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
    .chart-bar { width: 100%; border-radius: 6px 6px 0 0; transition: height 0.5s ease; min-height: 8px; }
    .bar-label { font-size: 0.7rem; color: var(--color-text-muted); }
    .bar-value { font-size: 0.75rem; font-weight: 600; }
  `],
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
  template: `
    <div class="table-demo">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Score</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.id) {
            <tr>
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.score }}</td>
              <td><span [class]="'chip chip--' + row.status">{{ row.status }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-demo { overflow: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    th { background: var(--color-surface-3); text-align: left; padding: 8px 12px; color: var(--color-text-muted); font-size: 0.75rem; text-transform: uppercase; }
    td { padding: 8px 12px; border-bottom: 1px solid var(--color-border); color: var(--color-text-secondary); }
    .chip { padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; &--active { background: rgba(34,197,94,0.15); color: #4ade80; } &--pending { background: rgba(245,158,11,0.15); color: #fbbf24; } &--inactive { background: rgba(100,116,139,0.15); color: #94a3b8; } }
  `],
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
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">⏳ Topic 8</p>
        <h1>Deferrable Views</h1>
        <p class="lead">
          Angular's <code>&#64;defer</code> block lazily loads components and their dependencies,
          improving initial load time without any webpack configuration.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li><code>&#64;defer</code> — marks content to be lazily loaded into a separate JS chunk</li>
          <li><code>&#64;placeholder</code> — shown before deferred content starts loading</li>
          <li><code>&#64;loading</code> — shown while deferred content is being fetched</li>
          <li><code>&#64;error</code> — shown if deferred content fails to load</li>
          <li><strong>Triggers</strong>: <code>on idle</code>, <code>on viewport</code>, <code>on interaction</code>, <code>on hover</code>, <code>on immediate</code>, <code>when expr</code></li>
          <li><code>minimum</code> on <code>&#64;loading</code> prevents loading flicker for fast connections</li>
          <li><code>prefetch</code> pre-loads the JS chunk without rendering yet</li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: Basic @defer -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Basic &#64;defer with &#64;placeholder and &#64;loading</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — always-deferred chart</p>
              @defer {
                <app-heavy-chart />
              } @placeholder {
                <div class="placeholder-block">
                  <div class="placeholder-icon">📊</div>
                  <span>Chart placeholder — waiting to load</span>
                </div>
              } @loading (minimum 200ms) {
                <div class="loading-block">
                  <div class="spinner"></div>
                  <span>Loading chart module...</span>
                </div>
              } @error {
                <div class="error-block">Failed to load chart</div>
              }
            </div>
          </div>
        </div>

        <!-- Example 2: on interaction trigger -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>Trigger: on interaction</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — load on interaction</p>
              <button #loadTableBtn class="btn btn--primary btn--sm">
                Click to Load Data Table
              </button>
              @defer (on interaction(loadTableBtn)) {
                <div style="margin-top: 0.75rem;">
                  <app-heavy-table />
                </div>
              } @placeholder {
                <div class="placeholder-block" style="margin-top: 0.75rem;">
                  <span>Click the button above — table will load on interaction</span>
                </div>
              } @loading {
                <div class="loading-block" style="margin-top: 0.75rem;">
                  <div class="spinner"></div>
                  <span>Loading...</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 3: on hover trigger -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>Trigger: on hover</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — load on hover</p>
              @defer (on hover(hoverCard)) {
                <div class="hover-loaded">
                  <h4>Hover Content Loaded! 🎉</h4>
                  <p>This content was loaded when you hovered the card below.</p>
                  <app-heavy-chart />
                </div>
              } @placeholder {
                <div #hoverCard class="hover-placeholder">
                  <span class="hover-icon">👆</span>
                  <span>Hover over this card to load the chart</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 4: when condition trigger -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>Trigger: when (condition-based)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — when condition</p>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <button
                  class="btn btn--sm"
                  [class.btn--primary]="conditionMet()"
                  [class.btn--secondary]="!conditionMet()"
                  (click)="conditionMet.update(v => !v)"
                >{{ conditionMet() ? '✓ Condition: true' : '○ Condition: false' }}</button>
                <span style="font-size: 0.8rem; color: var(--color-text-muted);">Toggle to load/unload</span>
              </div>
              @defer (when conditionMet()) {
                <div class="condition-loaded">
                  <div class="condition-badge">⚡ Loaded because condition = true</div>
                  <app-heavy-table />
                </div>
              } @placeholder {
                <div class="placeholder-block">
                  <span>Content will load when the condition becomes <strong>true</strong></span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 5: on viewport trigger -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Trigger: on viewport (Intersection Observer)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet5" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — viewport trigger</p>
              <div class="scroll-zone">
                <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                  Scroll down within this box ↓
                </p>
                <div style="height: 200px; overflow: visible;">
                  @defer (on viewport) {
                    <div class="viewport-loaded">
                      ✓ Viewport trigger fired — content loaded!
                      <app-heavy-chart />
                    </div>
                  } @placeholder {
                    <div class="viewport-placeholder">
                      <div class="vp-icon">👁️</div>
                      <span>Content deferred until viewport</span>
                    </div>
                  } @loading {
                    <div class="loading-block">
                      <div class="spinner"></div>
                      Loading viewport content...
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Wrap a heavy comment section in <code>&#64;defer (on viewport)</code> and add meaningful <code>&#64;placeholder</code> and <code>&#64;loading</code> blocks.</li>
          <li>Build a "Show More" button that triggers deferred content loading with <code>on interaction</code>.</li>
          <li>Implement a feature-flag gated <code>&#64;defer (when featureEnabled())</code> to conditionally load a beta component.</li>
          <li>Use <code>prefetch on idle</code> to pre-download a module before the user needs it, then render with <code>on interaction</code>.</li>
          <li>Combine <code>&#64;defer</code> with <code>&#64;placeholder (minimum 500ms)</code> to prevent layout shift and loading flicker.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-block { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem; background: var(--color-surface-3); border: 2px dashed var(--color-border); border-radius: 10px; color: var(--color-text-secondary); font-size: 0.9rem; }
    .placeholder-icon { font-size: 1.5rem; }
    .loading-block { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); border-radius: 8px; color: #60a5fa; font-size: 0.9rem; }
    .error-block { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; border-radius: 8px; padding: 1rem; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(59,130,246,0.2); border-top-color: #60a5fa; border-radius: 50%; animation: spin 0.8s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hover-placeholder { display: flex; align-items: center; gap: 0.75rem; padding: 1.5rem; background: var(--color-surface-3); border: 2px dashed var(--color-border); border-radius: 12px; cursor: pointer; transition: border-color 0.2s; &:hover { border-color: var(--color-primary); } }
    .hover-icon { font-size: 1.5rem; }
    .hover-loaded { border: 1px solid rgba(34,197,94,0.3); border-radius: 10px; padding: 1rem; background: rgba(34,197,94,0.05); h4 { color: var(--color-success); margin-bottom: 0.5rem; } p { font-size: 0.85rem; margin-bottom: 1rem; } }
    .condition-loaded { display: flex; flex-direction: column; gap: 0.75rem; }
    .condition-badge { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); color: #fbbf24; border-radius: 8px; padding: 8px 12px; font-size: 0.85rem; font-weight: 500; }
    .viewport-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem; background: var(--color-surface-3); border: 2px dashed var(--color-border); border-radius: 10px; text-align: center; color: var(--color-text-secondary); }
    .vp-icon { font-size: 2rem; }
    .viewport-loaded { padding: 1rem; border: 1px solid rgba(34,197,94,0.3); border-radius: 10px; background: rgba(34,197,94,0.05); color: var(--color-success); font-weight: 500; margin-bottom: 0.75rem; }
    .scroll-zone { background: var(--color-surface-3); border-radius: 10px; padding: 1.25rem; }
  `],
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
