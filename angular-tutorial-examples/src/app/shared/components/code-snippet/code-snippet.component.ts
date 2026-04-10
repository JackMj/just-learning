import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * CodeSnippetComponent safely renders code examples without Angular
 * misinterpreting @-blocks like @if, @for, @defer as template syntax.
 */
@Component({
  selector: 'app-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
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
