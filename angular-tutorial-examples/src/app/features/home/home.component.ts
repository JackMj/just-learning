import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPICS } from '../../core/models/topics.data';
import { TopicMeta } from '../../core/models/tutorial.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
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
