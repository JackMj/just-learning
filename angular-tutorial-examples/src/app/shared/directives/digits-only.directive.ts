import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Restricts an <input> to integer digits only (0-9).
 *
 * Improvements over a simple `input`-event approach:
 *  - Blocks non-digit keys at `keydown` so characters never appear in the field.
 *  - Intercepts `paste` and `drop` events and strips non-digits before applying.
 *  - Falls back to sanitising the value on `input` to catch autofill / IME / programmatic writes.
 *  - Sets `inputmode` and `pattern` so mobile browsers show the numeric keypad.
 *  - Error management is encapsulated in a single helper to keep each handler lean.
 */
@Directive({
  selector: '[appDigitsOnly]',
  standalone: true,
})
export class DigitsOnlyDirective {
  private readonly el = inject(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  /** Hint to mobile browsers to show the numeric keypad. */
  @HostBinding('attr.inputmode') readonly inputmode = 'numeric';
  /** Allows browsers / validators to understand the expected format. */
  @HostBinding('attr.pattern') readonly pattern = '[0-9]*';

  // ── Keyboard ────────────────────────────────────────────────────────────────

  /**
   * Block keys that would introduce non-digit characters before the DOM value
   * is updated. This gives immediate feedback and avoids any visible "flicker".
   *
   * Keys allowed through:
   *  - Digit keys (0-9) and numpad digits
   *  - Control keys: Backspace, Delete, Tab, Escape, Enter
   *  - Selection / navigation: ArrowLeft, ArrowRight, Home, End
   *  - OS shortcuts: Ctrl/Cmd + A / C / V / X / Z
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const { key, ctrlKey, metaKey } = event;

    const isDigit = /^\d$/.test(key);
    const isControl = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End',
    ].includes(key);
    const isShortcut = (ctrlKey || metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase());

    if (!isDigit && !isControl && !isShortcut) {
      event.preventDefault();
    }
  }

  // ── Paste ────────────────────────────────────────────────────────────────────

  /**
   * Reject the paste entirely when the clipboard text contains any non-digit
   * character. Silently stripping (e.g. turning "12.5" into "125") would
   * produce a different number without the user realising, which is confusing.
   * An all-or-nothing approach mirrors how the keydown guard works.
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const raw = event.clipboardData?.getData('text') ?? '';
    if (/\D/.test(raw)) return;

    this.insertAtCursor(raw);
    this.syncControl();
  }

  // ── Drop ─────────────────────────────────────────────────────────────────────

  /**
   * Reject the drop entirely when the dragged text contains any non-digit
   * character, for the same reason as onPaste.
   */
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();

    const raw = event.dataTransfer?.getData('text') ?? '';
    if (/\D/.test(raw)) return;

    const input = this.el.nativeElement as HTMLInputElement;
    input.focus();
    input.value = raw;
    this.syncControl();
  }

  // ── Input (safety net) ───────────────────────────────────────────────────────

  /**
   * Last line of defence: sanitise whatever ends up in the field (e.g. autofill,
   * IME composition, or programmatic value writes) and keep the reactive-forms
   * control in sync with the sanitised value.
   */
  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '');

    if (input.value !== clean) {
      const cursor = input.selectionStart ?? clean.length;
      input.value = clean;
      // Restore cursor position after we overwrote the value.
      input.setSelectionRange(cursor, cursor);
    }

    this.syncControl();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /**
   * Insert `text` at the current cursor / selection position inside the input,
   * replicating what the browser does for a normal paste.
   */
  private insertAtCursor(text: string): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const current = input.value;

    input.value = current.slice(0, start) + text + current.slice(end);
    const newCursor = start + text.length;
    input.setSelectionRange(newCursor, newCursor);
  }

  /**
   * Propagate the current DOM value to the reactive-forms control and update
   * the `noDecimals` validation error accordingly.
   *
   * Using `setValue` (via `control.setValue`) would trigger another `input`
   * cycle; instead we call the lower-level `control.setErrors` so we only
   * touch the error state, leaving value-update to Angular's own
   * `(input)` binding or `ControlValueAccessor`.
   */
  private syncControl(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    const input = this.el.nativeElement as HTMLInputElement;
    const hasNonDigits = /\D/.test(input.value);

    // Preserve every existing error except `noDecimals`, then re-apply it only
    // when the current value still contains non-digit characters.
    const { noDecimals: _removed, ...otherErrors } = control.errors ?? {};
    const next = hasNonDigits
      ? { ...otherErrors, noDecimals: true }
      : Object.keys(otherErrors).length
        ? otherErrors
        : null;

    control.setErrors(next);
  }
}
