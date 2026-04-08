import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
  withInMemoryScrolling,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Example auth interceptor — demonstrates functional interceptor pattern.
 * In a real app, inject(AuthService) would provide the token.
 */
const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Add a request ID header to all outgoing requests
  const trackedReq = req.clone({
    setHeaders: {
      'X-App-Source': 'angular-tutorial-examples',
    },
  });
  return next(trackedReq);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),     // route params → component inputs
      withViewTransitions(),            // View Transitions API
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(
      withFetch(),                      // use fetch API instead of XHR
      withInterceptors([loggingInterceptor]),
    ),
  ],
};
