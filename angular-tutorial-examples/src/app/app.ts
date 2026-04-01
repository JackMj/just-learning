import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './shared/components/sidebar-nav/sidebar-nav.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { TOPICS } from './core/models/topics.data';
import { TopicMeta } from './core/models/tutorial.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent, NotificationToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly topics: readonly TopicMeta[] = TOPICS;
}
