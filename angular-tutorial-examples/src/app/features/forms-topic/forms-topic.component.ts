import { CodeSnippetComponent } from '../../shared/components/code-snippet/code-snippet.component';
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
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, CodeSnippetComponent],
  template: `
    <div class="topic-page">
      <header class="topic-header">
        <p class="topic-label">📝 Topic 6</p>
        <h1>Forms</h1>
        <p class="lead">
          Angular provides two form strategies: template-driven for simple cases,
          and reactive forms for complex validation, dynamic controls, and testability.
        </p>
      </header>

      <div class="theory-box">
        <h4>📖 Theory</h4>
        <ul>
          <li><strong>Template-driven</strong> — uses <code>NgModel</code> and directives; simpler but less explicit</li>
          <li><strong>Reactive Forms</strong> — model-driven with <code>FormBuilder</code>, <code>FormGroup</code>, <code>FormControl</code>, <code>FormArray</code></li>
          <li>Use <code>Validators.compose()</code> or array syntax for multiple validators per control</li>
          <li>Cross-field validators: apply on <code>FormGroup</code> level</li>
          <li>Async validators for server-side checks (e.g. email already taken)</li>
          <li><code>FormArray</code> for dynamic, repeating form groups (e.g. multi-address)</li>
          <li>Angular v17+ supports experimental signal-based forms via <code>FormField</code></li>
        </ul>
      </div>

      <section class="topic-section">
        <h2>Examples</h2>

        <!-- Example 1: Template-Driven -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">1</div>
            <h3>Template-Driven Form</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet1" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — template-driven contact form</p>
              <form #contactForm="ngForm" class="form" (ngSubmit)="submitContact(contactForm.value, !!contactForm.valid)">
                <div class="form-group" [class.has-error]="contactName.invalid && contactName.touched">
                  <label>Full Name *</label>
                  <input name="name" ngModel required minlength="2" #contactName="ngModel" placeholder="Your name" />
                  @if (contactName.invalid && contactName.touched) {
                    <span class="error-message">Name is required (min 2 chars)</span>
                  }
                </div>
                <div class="form-group" [class.has-error]="contactEmail.invalid && contactEmail.touched">
                  <label>Email *</label>
                  <input name="email" ngModel required email #contactEmail="ngModel" placeholder="you@example.com" />
                  @if (contactEmail.invalid && contactEmail.touched) {
                    <span class="error-message">Valid email is required</span>
                  }
                </div>
                <div class="form-group">
                  <label>Message *</label>
                  <textarea name="message" ngModel required minlength="10" #contactMsg="ngModel" placeholder="Your message..."></textarea>
                  @if (contactMsg.invalid && contactMsg.touched) {
                    <span class="error-message">Message needs at least 10 characters</span>
                  }
                </div>
                <button class="btn btn--primary" type="submit" [disabled]="contactForm.invalid">Send Message</button>
              </form>
              @if (contactSubmitted()) {
                <div class="success-banner">✓ Message sent! (template-driven form)</div>
              }
            </div>
          </div>
        </div>

        <!-- Example 2: Reactive Form Basics -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">2</div>
            <h3>Reactive Forms with FormBuilder</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet2" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — reactive login form</p>
              <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="form">
                <div class="form-group" [class.has-error]="loginEmailCtrl.invalid && loginEmailCtrl.touched">
                  <label>Email</label>
                  <input type="email" formControlName="email" placeholder="admin@example.com" />
                  @if (loginEmailCtrl.hasError('required') && loginEmailCtrl.touched) {
                    <span class="error-message">Email is required</span>
                  }
                  @if (loginEmailCtrl.hasError('email') && loginEmailCtrl.touched) {
                    <span class="error-message">Must be a valid email</span>
                  }
                </div>
                <div class="form-group" [class.has-error]="loginPasswordCtrl.invalid && loginPasswordCtrl.touched">
                  <label>Password</label>
                  <input type="password" formControlName="password" placeholder="Min 8 chars" />
                  @if (loginPasswordCtrl.invalid && loginPasswordCtrl.touched) {
                    <span class="error-message">Password must be at least 8 characters</span>
                  }
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <input type="checkbox" formControlName="rememberMe" id="remember" style="width: auto;" />
                  <label for="remember" style="margin: 0; cursor: pointer;">Remember me</label>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <button class="btn btn--primary" type="submit" [disabled]="loginForm.invalid">Sign In</button>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted);">
                    Status: <strong [class]="loginForm.valid ? 'text-success' : 'text-error'">
                      {{ loginForm.valid ? 'Valid' : 'Invalid' }}
                    </strong>
                  </span>
                </div>
              </form>
              @if (loginSubmitted()) {
                <div class="success-banner">✓ Logged in as: {{ loginForm.get('email')?.value }}</div>
              }
            </div>
          </div>
        </div>

        <!-- Example 3: Custom Validators & Cross-Field Validation -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">3</div>
            <h3>Custom Validators & Cross-Field Validation</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet3" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — register form with custom validation</p>
              <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" class="form">
                <div class="two-col">
                  <div class="form-group" [class.has-error]="regCtrl('firstName').invalid && regCtrl('firstName').touched">
                    <label>First Name</label>
                    <input formControlName="firstName" placeholder="Jane" />
                    @if (regCtrl('firstName').invalid && regCtrl('firstName').touched) {
                      <span class="error-message">Required</span>
                    }
                  </div>
                  <div class="form-group" [class.has-error]="regCtrl('lastName').invalid && regCtrl('lastName').touched">
                    <label>Last Name</label>
                    <input formControlName="lastName" placeholder="Doe" />
                    @if (regCtrl('lastName').invalid && regCtrl('lastName').touched) {
                      <span class="error-message">Required</span>
                    }
                  </div>
                </div>
                <div class="form-group" [class.has-error]="regCtrl('email').invalid && regCtrl('email').touched">
                  <label>Email</label>
                  <input type="email" formControlName="email" placeholder="jane@example.com" />
                  @if (regCtrl('email').invalid && regCtrl('email').touched) {
                    <span class="error-message">Valid email required</span>
                  }
                </div>
                <div class="form-group" [class.has-error]="regCtrl('password').invalid && regCtrl('password').touched">
                  <label>Password</label>
                  <input type="password" formControlName="password" placeholder="Use Abc123!@" />
                  @if (regCtrl('password').hasError('passwordStrength') && regCtrl('password').touched) {
                    <div class="password-hints">
                      <span [class]="regCtrl('password').errors?.['passwordStrength'].hasUpper ? 'hint-ok' : 'hint-fail'">uppercase</span>
                      <span [class]="regCtrl('password').errors?.['passwordStrength'].hasLower ? 'hint-ok' : 'hint-fail'">lowercase</span>
                      <span [class]="regCtrl('password').errors?.['passwordStrength'].hasDigit ? 'hint-ok' : 'hint-fail'">digit</span>
                      <span [class]="regCtrl('password').errors?.['passwordStrength'].hasSpecial ? 'hint-ok' : 'hint-fail'">special (!@#$)</span>
                    </div>
                  }
                </div>
                <div class="form-group" [class.has-error]="regCtrl('confirmPassword').touched && registerForm.hasError('passwordMismatch')">
                  <label>Confirm Password</label>
                  <input type="password" formControlName="confirmPassword" placeholder="Repeat password" />
                  @if (registerForm.hasError('passwordMismatch') && regCtrl('confirmPassword').touched) {
                    <span class="error-message">Passwords do not match</span>
                  }
                </div>
                <button class="btn btn--primary" type="submit" [disabled]="registerForm.invalid">Create Account</button>
              </form>
              @if (registerSubmitted()) {
                <div class="success-banner">✓ Account created for {{ registerForm.get('email')?.value }}</div>
              }
            </div>
          </div>
        </div>

        <!-- Example 4: FormArray -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">4</div>
            <h3>FormArray — Dynamic Form Controls</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet4" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — resume skills builder</p>
              <form [formGroup]="skillsForm" (ngSubmit)="submitSkills()" class="form">
                <div class="form-group">
                  <label>Developer Name</label>
                  <input formControlName="name" placeholder="Your name" />
                </div>
                <div class="form-group">
                  <label>Skills</label>
                  <div formArrayName="skills" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    @for (skill of skillsArray.controls; track $index) {
                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <input [formControlName]="$index" placeholder="e.g. Angular" style="flex: 1;" />
                        <button type="button" class="btn btn--sm btn--secondary" (click)="removeSkill($index)">✕</button>
                      </div>
                    }
                  </div>
                  <button type="button" class="btn btn--sm btn--accent" style="margin-top: 0.5rem;" (click)="addSkill()">+ Add Skill</button>
                </div>
                <button class="btn btn--primary" type="submit" [disabled]="skillsForm.invalid">Save Profile</button>
              </form>
              @if (skillsSubmitted()) {
                <div class="result-display" style="margin-top: 0.75rem;">
                  <strong>{{ skillsForm.get('name')?.value }}</strong>'s skills:
                  {{ skillsArray.value.join(', ') }}
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Example 5: Form State & Pending/Dirty/Touched -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">5</div>
            <h3>Form State — pristine, dirty, touched, pending</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet5" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — form state inspector</p>
              <form [formGroup]="stateForm" class="form">
                <div class="form-group">
                  <label>Name</label>
                  <input formControlName="name" placeholder="Type something..." />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" formControlName="email" placeholder="Click and leave..." />
                </div>
              </form>
              <div class="state-grid">
                @for (prop of formStateProps; track prop.key) {
                  <div class="state-chip" [class.state-chip--true]="getFormState(prop.key)">
                    <span class="state-val">{{ getFormState(prop.key) ? 'T' : 'F' }}</span>
                    <span>{{ prop.key }}</span>
                  </div>
                }
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                <button class="btn btn--sm btn--secondary" (click)="stateForm.markAllAsTouched()">markAllAsTouched()</button>
                <button class="btn btn--sm btn--secondary" (click)="stateForm.reset()">reset()</button>
                <button class="btn btn--sm btn--secondary" (click)="stateForm.get('name')?.disable()">disable name</button>
                <button class="btn btn--sm btn--secondary" (click)="stateForm.get('name')?.enable()">enable name</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Example 6: Typed Forms -->
        <div class="example-container">
          <div class="example-container__header">
            <div class="example-number">6</div>
            <h3>Strictly Typed Forms (Angular 14+)</h3>
          </div>
          <div class="example-container__body">
            <app-code [code]="codeSnippet6" />
            <div class="demo-area">
              <p class="demo-label">Live Demo — strictly typed profile form</p>
              <form [formGroup]="typedProfileForm" (ngSubmit)="submitProfile()" class="form">
                <div class="form-group">
                  <label>Username</label>
                  <input formControlName="username" placeholder="john_doe" />
                </div>
                <div class="form-group">
                  <label>Age</label>
                  <input type="number" formControlName="age" placeholder="25" />
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <select formControlName="role">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <button class="btn btn--primary" type="submit">Save</button>
              </form>
              @if (profileResult()) {
                <div class="result-display" style="margin-top: 0.75rem;">
                  Typed value: <code>{{ profileResult() | json }}</code>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <div class="exercise-box">
        <h4>🏋️ Exercises</h4>
        <ol>
          <li>Build a template-driven form for a newsletter signup with email and frequency (radio buttons).</li>
          <li>Create a reactive checkout form with shipping address, payment method, and order summary.</li>
          <li>Write a custom async validator that simulates checking if an email is already registered.</li>
          <li>Build an experience timeline using <code>FormArray</code> where users can add/remove job entries.</li>
          <li>Implement a multi-step wizard form using <code>FormGroup</code> per step with validation gating.</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .form { max-width: 500px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .text-success { color: var(--color-success); }
    .text-error { color: var(--color-error); }
    .error-message { color: var(--color-error); font-size: 0.8rem; margin-top: 2px; }
    .password-hints { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem; }
    .hint-ok { background: rgba(34,197,94,0.15); color: #4ade80; border-radius: 20px; padding: 2px 10px; font-size: 0.75rem; }
    .hint-fail { background: rgba(239,68,68,0.15); color: #f87171; border-radius: 20px; padding: 2px 10px; font-size: 0.75rem; }
    .success-banner { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; border-radius: 8px; padding: 12px 16px; margin-top: 0.75rem; font-weight: 500; }
    .state-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
    .state-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; background: var(--color-surface-3); border-radius: 20px; font-size: 0.8rem; border: 1px solid var(--color-border); &--true { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: #4ade80; } }
    .state-val { font-weight: 700; font-family: 'Fira Code', monospace; width: 14px; }
  `],
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
