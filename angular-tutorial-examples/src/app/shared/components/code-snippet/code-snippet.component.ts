import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * CodeSnippetComponent safely renders code examples without Angular
 * misinterpreting @-blocks like @if, @for, @defer as template syntax.
 */
@Component({
  selector: 'app-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<pre><code [innerHTML]="escaped()"></code></pre>`,
  styles: [`
    pre {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      overflow-x: auto;
      line-height: 1.6;
      margin: 1rem 0;
    }
    code {
      background: none;
      border: none;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.85rem;
      font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    }
  `],
})
export class CodeSnippetComponent {
  readonly code = input.required<string>();

  escaped(): string {
    return this.code()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
