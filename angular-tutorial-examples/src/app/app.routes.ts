import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Angular Tutorial Examples',
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./features/components-topic/components-topic.component').then(
        m => m.ComponentsTopicComponent
      ),
    title: 'Components — Angular Tutorial',
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./features/templates-topic/templates-topic.component').then(
        m => m.TemplatesTopicComponent
      ),
    title: 'Templates — Angular Tutorial',
  },
  {
    path: 'signals',
    loadComponent: () =>
      import('./features/signals-topic/signals-topic.component').then(
        m => m.SignalsTopicComponent
      ),
    title: 'Signals — Angular Tutorial',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services-topic/services-topic.component').then(
        m => m.ServicesTopicComponent
      ),
    title: 'Services & DI — Angular Tutorial',
  },
  {
    path: 'routing',
    loadComponent: () =>
      import('./features/routing-topic/routing-topic.component').then(
        m => m.RoutingTopicComponent
      ),
    title: 'Routing — Angular Tutorial',
  },
  {
    path: 'forms',
    loadComponent: () =>
      import('./features/forms-topic/forms-topic.component').then(
        m => m.FormsTopicComponent
      ),
    title: 'Forms — Angular Tutorial',
  },
  {
    path: 'http',
    loadComponent: () =>
      import('./features/http-topic/http-topic.component').then(
        m => m.HttpTopicComponent
      ),
    title: 'HTTP & API — Angular Tutorial',
  },
  {
    path: 'deferrable-views',
    loadComponent: () =>
      import(
        './features/deferrable-views-topic/deferrable-views-topic.component'
      ).then(m => m.DeferrableViewsTopicComponent),
    title: 'Deferrable Views — Angular Tutorial',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
