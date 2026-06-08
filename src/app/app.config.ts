import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importamos withInterceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
// Importamos nuestro nuevo interceptor
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
// 1. IMPORTAMOS LA LIBRERÍA DE GRÁFICOS
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Le decimos al cliente HTTP que use nuestro interceptor
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};
