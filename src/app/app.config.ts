import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideNzI18n, es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { UserOutline, HomeOutline, LoadingOutline, PlusCircleOutline, ReloadOutline, DeleteOutline, CloseOutline, CheckCircleOutline } from '@ant-design/icons-angular/icons';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideNzI18n(es_ES),
    provideNzIcons([UserOutline, HomeOutline, LoadingOutline, PlusCircleOutline, ReloadOutline, DeleteOutline, CloseOutline, CheckCircleOutline, LoadingOutline])
  ]
};
