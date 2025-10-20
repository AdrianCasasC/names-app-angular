import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';

import { UserOutline, HomeOutline, LoadingOutline } from '@ant-design/icons-angular/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideNzIcons([UserOutline, HomeOutline, LoadingOutline])
  ]
};
