import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
import { DigitsOnlyDirective } from '../../shared/directives/digits-only.directive';
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

/* ─── Custom Validators ──────────────────────────────────── */
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);

  if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
    return {
      passwordStrength: {
        hasUpper, hasLower, hasDigit, hasSpecial,
        message: 'Password needs uppercase, lowercase, digit, and special character.',
      },
    };
  }
  return null;
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

function futureDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const date = new Date(value);
  return date > new Date() ? null : { pastDate: true };
}

@Component({
  selector: 'app-forms-topic',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, CodeSnippetComponent, DigitsOnlyDirective],
  templateUrl: './forms-topic.component.html',
  styleUrl: './forms-topic.component.scss',
})
export class FormsTopicComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notif = inject(NotificationService);

  /* Ex 1 — template driven */
  readonly contactSubmitted = signal(false);
  submitContact(value: Record<string, string>, valid: boolean): void {
    if (valid) {
      this.contactSubmitted.set(true);
      this.notif.success('Contact form submitted!');
      setTimeout(() => this.contactSubmitted.set(false), 3000);
    }
  }

  /* Ex 2 — reactive login */
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });
  get loginEmailCtrl() { return this.loginForm.get('email')!; }
  get loginPasswordCtrl() { return this.loginForm.get('password')!; }
  readonly loginSubmitted = signal(false);
  submitLogin(): void {
    if (this.loginForm.valid) {
      this.loginSubmitted.set(true);
      this.notif.success('Logged in successfully!');
      setTimeout(() => this.loginSubmitted.set(false), 3000);
    }
  }

  /* Ex 3 — register + custom validators */
  readonly registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  regCtrl(name: string) { return this.registerForm.get(name)!; }
  readonly registerSubmitted = signal(false);
  submitRegister(): void {
    if (this.registerForm.valid) {
      this.registerSubmitted.set(true);
      this.notif.success('Account created!');
      setTimeout(() => this.registerSubmitted.set(false), 3000);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  /* Ex 4 — FormArray */
  readonly skillsForm = this.fb.group({
    name: ['', Validators.required],
    skills: this.fb.array([
      this.fb.control('TypeScript', Validators.required),
      this.fb.control('Angular', Validators.required),
    ]),
  });
  get skillsArray(): FormArray { return this.skillsForm.get('skills') as FormArray; }
  addSkill(): void { this.skillsArray.push(this.fb.control('', Validators.required)); }
  removeSkill(i: number): void { this.skillsArray.removeAt(i); }
  readonly skillsSubmitted = signal(false);
  submitSkills(): void {
    if (this.skillsForm.valid) {
      this.skillsSubmitted.set(true);
      setTimeout(() => this.skillsSubmitted.set(false), 3000);
    }
  }

  /* Ex 5 — form state */
  readonly stateForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  readonly formStateProps = [
    { key: 'valid' }, { key: 'invalid' }, { key: 'pristine' },
    { key: 'dirty' }, { key: 'touched' }, { key: 'untouched' },
  ];

  /* Ex 6 — typed forms */
  readonly typedProfileForm = this.fb.group({
    username: this.fb.nonNullable.control('', Validators.required),
    age: [null as number | null],
    role: this.fb.nonNullable.control<'admin' | 'editor' | 'viewer'>('viewer'),
  });
  readonly profileResult = signal<Record<string, unknown> | null>(null);
  submitProfile(): void {
    if (this.typedProfileForm.valid) {
      this.profileResult.set(this.typedProfileForm.getRawValue());
    }
  }

  getFormState(key: string): boolean {
    type FormKey = 'valid' | 'invalid' | 'pristine' | 'dirty' | 'touched' | 'untouched';
    return this.stateForm[key as FormKey] as boolean;
  }

  /* Ex 7 — digits-only directive */
  readonly digitsForm = this.fb.group({
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
  });
  get quantityCtrl() { return this.digitsForm.get('quantity')!; }
  get postalCtrl()   { return this.digitsForm.get('postalCode')!; }
  readonly digitsSubmitted = signal<Record<string, unknown> | null>(null);
  submitDigits(): void {
    if (this.digitsForm.valid) {
      this.digitsSubmitted.set(this.digitsForm.getRawValue());
      this.notif.success('Order placed!');
      setTimeout(() => this.digitsSubmitted.set(null), 4000);
    } else {
      this.digitsForm.markAllAsTouched();
    }
  }

  /* ── Code snippets ── */
  readonly codeSnippet1 = `// Import FormsModule in component
import { FormsModule } from '@angular/forms';

// Template
<form #f="ngForm" (ngSubmit)="onSubmit(f)">
  <input name="email" [(ngModel)]="email"
         required email #emailCtrl="ngModel">

  @if (emailCtrl.invalid && emailCtrl.touched) {
    <span class="error">Valid email required</span>
  }

  <button [disabled]="f.invalid">Submit</button>
</form>`;
  readonly codeSnippet2 = `// TypeScript
private readonly fb = inject(FormBuilder);

readonly loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  rememberMe: [false],
});

// Type-safe helper
get emailControl() {
  return this.loginForm.get('email')!;
}

onSubmit(): void {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.getRawValue();
  }
}`;
  readonly codeSnippet3 = `// Validator factory function
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value ?? '';
  const hasUpper = /[A-Z]/.test(value);
  // ...
  return hasUpper && hasLower && hasDigit ? null : { passwordStrength: {...} };
}

// Cross-field validator on FormGroup
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pw === confirm ? null : { passwordMismatch: true };
}

// Apply on group
this.fb.group({ ... }, { validators: passwordMatchValidator })`;
  readonly codeSnippet4 = `readonly skillsForm = this.fb.group({
  name: ['', Validators.required],
  skills: this.fb.array([          // dynamic list
    this.fb.control('TypeScript', Validators.required),
  ]),
});

get skillsArray(): FormArray {
  return this.skillsForm.get('skills') as FormArray;
}

addSkill(): void {
  this.skillsArray.push(this.fb.control('', Validators.required));
}

removeSkill(index: number): void {
  this.skillsArray.removeAt(index);
}`;
  readonly codeSnippet5 = `// Angular tracks form state automatically:
form.pristine   // true if never changed
form.dirty      // true if any value changed
form.touched    // true if any control was blurred
form.untouched  // true if no control blurred
form.valid      // true if all validators pass
form.invalid    // true if any validator fails
form.pending    // true if async validator running

// Per-control access
form.get('email')?.valid
form.get('email')?.hasError('required')
form.get('email')?.getError('minlength')?.requiredLength

// Mark all as touched (show all errors on submit)
form.markAllAsTouched();

// Reset form
form.reset({ email: '' });`;
  readonly codeSnippet7 = `// digits-only.directive.ts  (standalone, drop-in)
@Directive({ selector: '[appDigitsOnly]', standalone: true })
export class DigitsOnlyDirective {
  private readonly el = inject(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  // Mobile browsers show numeric keypad
  @HostBinding('attr.inputmode') readonly inputmode = 'numeric';
  @HostBinding('attr.pattern')   readonly pattern   = '[0-9]*';

  // 1. Block at keydown — character never enters the DOM
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const { key, ctrlKey, metaKey } = event;
    const isDigit    = /^\\d$/.test(key);
    const isControl  = ['Backspace','Delete','Tab','Escape','Enter',
                        'ArrowLeft','ArrowRight','Home','End'].includes(key);
    const isShortcut = (ctrlKey || metaKey) &&
                       ['a','c','v','x','z'].includes(key.toLowerCase());
    if (!isDigit && !isControl && !isShortcut) event.preventDefault();
  }

  // 2. Reject paste if it contains any non-digit (e.g. "12.5" → blocked entirely)
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const raw = event.clipboardData?.getData('text') ?? '';
    if (/\\D/.test(raw)) return;   // decimal / letter → do nothing
    this.insertAtCursor(raw);
    this.syncControl();
  }

  // 3. Reject drop if it contains any non-digit
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const raw = event.dataTransfer?.getData('text') ?? '';
    if (/\\D/.test(raw)) return;   // decimal / letter → do nothing
    (this.el.nativeElement as HTMLInputElement).value = raw;
    this.syncControl();
  }

  // 4. Safety net for autofill / IME / programmatic writes
  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const clean = input.value.replace(/\\D/g, '');
    if (input.value !== clean) {
      const cursor = input.selectionStart ?? clean.length;
      input.value  = clean;
      input.setSelectionRange(cursor, cursor);
    }
    this.syncControl();
  }

  private insertAtCursor(text: string): void {
    const input  = this.el.nativeElement as HTMLInputElement;
    const start  = input.selectionStart ?? 0;
    const end    = input.selectionEnd   ?? 0;
    input.value  = input.value.slice(0, start) + text + input.value.slice(end);
    input.setSelectionRange(start + text.length, start + text.length);
  }

  private syncControl(): void {
    const control = this.ngControl?.control;
    if (!control) return;
    const hasNonDigits = /\\D/.test((this.el.nativeElement as HTMLInputElement).value);
    const { noDecimals: _, ...rest } = control.errors ?? {};
    control.setErrors(
      hasNonDigits ? { ...rest, noDecimals: true }
                   : Object.keys(rest).length ? rest : null
    );
  }
}

// Usage — works with reactive forms and template-driven forms alike:
// <input formControlName="quantity" appDigitsOnly />
// <input [(ngModel)]="qty" appDigitsOnly />`;

  readonly codeSnippet6 = `// TypeScript infers exact types from form structure
import { FormControl, FormGroup } from '@angular/forms';

interface ProfileForm {
  username: FormControl<string>;
  age:      FormControl<number | null>;
  role:     FormControl<'admin' | 'editor' | 'viewer'>;
}

// FormBuilder infers types — getRawValue() is fully typed
readonly profileForm = this.fb.group<ProfileForm>({
  username: new FormControl('', { nonNullable: true }),
  age:      new FormControl<number | null>(null),
  role:     new FormControl<'admin' | 'editor' | 'viewer'>('viewer', { nonNullable: true }),
});

// getRawValue() is typed: { username: string, age: number | null, role: ... }
const { username, age, role } = this.profileForm.getRawValue();`;
}
