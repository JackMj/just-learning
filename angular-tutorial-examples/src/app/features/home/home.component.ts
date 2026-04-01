import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPICS } from '../../core/models/topics.data';
import { TopicMeta } from '../../core/models/tutorial.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="pulse-dot"></span>
            Angular v21 · TypeScript 5.9
          </div>
          <h1 class="hero__title">
            Angular Tutorial
            <span class="gradient-text">Examples</span>
          </h1>
          <p class="hero__description">
            Comprehensive examples, theory and exercises for every major Angular concept.
            Built with best practices for senior Angular developers.
          </p>
          <div class="hero__stats">
            <div class="stat">
              <span class="stat__value">{{ topics.length }}</span>
              <span class="stat__label">Topics</span>
            </div>
            <div class="stat">
              <span class="stat__value">{{ totalExamples }}</span>
              <span class="stat__label">Examples</span>
            </div>
            <div class="stat">
              <span class="stat__value">v21</span>
              <span class="stat__label">Angular</span>
            </div>
          </div>
        </div>
        <div class="hero__visual">
          <div class="angular-logo">⬡</div>
          <div class="orbit orbit--1"><div class="orbit-dot"></div></div>
          <div class="orbit orbit--2"><div class="orbit-dot"></div></div>
          <div class="orbit orbit--3"><div class="orbit-dot"></div></div>
        </div>
      </section>

      <section class="topics-grid">
        <h2>Browse Topics</h2>
        <div class="grid">
          @for (topic of topics; track topic.id) {
            <a [routerLink]="topic.route" class="topic-card">
              <div class="topic-card__icon">{{ topic.icon }}</div>
              <div class="topic-card__content">
                <div class="topic-card__header">
                  <h3>{{ topic.title }}</h3>
                  <span class="badge badge--{{ difficultyColor(topic.difficulty) }}">
                    {{ topic.difficulty }}
                  </span>
                </div>
                <p>{{ topic.description }}</p>
                <div class="topic-card__tags">
                  @for (tag of topic.tags.slice(0, 3); track tag) {
                    <code>{{ tag }}</code>
                  }
                </div>
                <div class="topic-card__footer">
                  <span class="example-count">{{ topic.exampleCount }} examples</span>
                  <span class="arrow">→</span>
                </div>
              </div>
            </a>
          }
        </div>
      </section>

      <section class="features">
        <h2>What's Inside</h2>
        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-item">
              <span class="feature-icon">{{ feature.icon }}</span>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home { padding: 2rem; max-width: 1200px; margin: 0 auto; }

    /* Hero */
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      padding: 3rem 0 4rem;
      min-height: 400px;

      &__badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(221,0,49,0.1);
        border: 1px solid rgba(221,0,49,0.25);
        border-radius: 20px;
        color: var(--color-primary-light);
        font-size: 0.8rem;
        font-weight: 600;
        padding: 5px 14px;
        margin-bottom: 1.25rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &__title {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: 1rem;
      }

      &__description {
        font-size: 1.1rem;
        max-width: 520px;
        margin-bottom: 2rem;
        color: var(--color-text-secondary);
      }

      &__stats {
        display: flex;
        gap: 2rem;
      }

      &__visual {
        position: relative;
        width: 280px;
        height: 280px;
        flex-shrink: 0;
      }

      &__content { flex: 1; }
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-success);
      display: inline-block;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 50%, #ff8fa3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat {
      display: flex;
      flex-direction: column;
      &__value { font-size: 1.75rem; font-weight: 700; color: var(--color-text); }
      &__label { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; }
    }

    /* Angular logo animation */
    .angular-logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 5rem;
      color: var(--color-primary);
      z-index: 1;
      text-shadow: 0 0 40px rgba(221,0,49,0.5);
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, -50%) translateY(0); }
      50% { transform: translate(-50%, -50%) translateY(-10px); }
    }

    .orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1px solid rgba(221,0,49,0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);

      &--1 { width: 140px; height: 140px; animation: spin 8s linear infinite; }
      &--2 { width: 200px; height: 200px; animation: spin 12s linear infinite reverse; }
      &--3 { width: 260px; height: 260px; animation: spin 16s linear infinite; }

      .orbit-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-primary);
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 0 8px rgba(221,0,49,0.8);
      }
    }

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Topics Grid */
    .topics-grid {
      margin-bottom: 4rem;
      h2 { margin-bottom: 1.5rem; }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .topic-card {
      display: flex;
      gap: 1rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: all var(--transition-base);

      &:hover {
        border-color: rgba(221,0,49,0.4);
        box-shadow: 0 0 20px rgba(221,0,49,0.1);
        transform: translateY(-2px);

        .arrow { transform: translateX(4px); }
      }

      &__icon {
        font-size: 2rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-surface-3);
        border-radius: var(--radius-md);
        flex-shrink: 0;
      }

      &__content { flex: 1; min-width: 0; }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
        h3 { font-size: 1rem; margin: 0; }
      }

      p {
        font-size: 0.85rem;
        margin-bottom: 0.75rem;
        color: var(--color-text-secondary);
      }

      &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 0.75rem;
        code { font-size: 0.7rem; }
      }

      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--color-text-muted);
      }
    }

    .example-count { color: var(--color-primary-light); font-weight: 500; }
    .arrow { transition: transform var(--transition-fast); color: var(--color-primary); }

    /* Features */
    .features {
      margin-bottom: 4rem;
      h2 { margin-bottom: 1.5rem; }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .feature-item {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      .feature-icon { font-size: 1.75rem; display: block; margin-bottom: 0.75rem; }
      h4 { margin-bottom: 0.4rem; font-size: 0.95rem; }
      p { font-size: 0.82rem; margin: 0; }
    }

    .badge--beginner { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); border-radius: 20px; font-size: 0.65rem; padding: 2px 8px; font-weight: 600; }
    .badge--intermediate { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); border-radius: 20px; font-size: 0.65rem; padding: 2px 8px; font-weight: 600; }
    .badge--advanced { background: rgba(221,0,49,0.15); color: var(--color-primary-light); border: 1px solid rgba(221,0,49,0.3); border-radius: 20px; font-size: 0.65rem; padding: 2px 8px; font-weight: 600; }

    @media (max-width: 900px) {
      .hero { flex-direction: column; text-align: center; }
      .hero__visual { display: none; }
      .hero__title { font-size: 2.25rem; }
    }
  `],
})
export class HomeComponent {
  readonly topics = TOPICS;
  readonly totalExamples = TOPICS.reduce((sum, t) => sum + t.exampleCount, 0);

  readonly features: Array<{ icon: string; title: string; description: string }> = [
    { icon: '📚', title: 'Theory First', description: 'Each example starts with clear explanations of the concept.' },
    { icon: '💻', title: 'Live Examples', description: 'Interactive demos you can explore in real-time.' },
    { icon: '🏋️', title: 'Exercises', description: 'Practice challenges to reinforce your understanding.' },
    { icon: '🏆', title: 'Best Practices', description: 'Senior-level patterns and TypeScript strict typing.' },
    { icon: '⚡', title: 'Signals', description: 'Modern Angular reactivity with signals throughout.' },
    { icon: '🔒', title: 'Strict Mode', description: 'All examples use TypeScript strict mode.' },
  ];

  difficultyColor(difficulty: TopicMeta['difficulty']): string {
    const map: Record<TopicMeta['difficulty'], string> = {
      beginner: 'beginner',
      intermediate: 'intermediate',
      advanced: 'advanced',
    };
    return map[difficulty];
  }
}
