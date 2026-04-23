import { inject, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppStateService } from './core/services/app-state.service';

function launchRedirect(): string {
  const appState = inject(AppStateService);
  if (appState.shouldShowWelcomeOnLaunch()) {
    appState.markOnboardingSeen();
    return 'welcome';
  }

  return 'home';
}

const routes: Routes = [
  {
    path: '',
    redirectTo: launchRedirect,
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    data: { hideBottomNav: true },
    loadChildren: () => import('./features/welcome/welcome.module').then((m) => m.WelcomeModule)
  },
  {
    path: 'partner-registration',
    data: { hideBottomNav: true },
    loadChildren: () =>
      import('./features/partner-registration/partner-registration.module').then((m) => m.PartnerRegistrationModule)
  },
  {
    path: 'dashboard',
    data: { hideBottomNav: true },
    loadChildren: () => import('./features/admin-dashboard/admin-dashboard.module').then((m) => m.AdminDashboardModule)
  },
  {
    path: 'auth/complete-registration',
    data: { hideBottomNav: true },
    loadChildren: () =>
      import('./features/complete-registration/complete-registration.module').then((m) => m.CompleteRegistrationModule)
  },
  {
    path: 'auth/app-password-reset',
    data: { hideBottomNav: true },
    loadChildren: () =>
      import('./features/complete-registration/complete-registration.module').then((m) => m.CompleteRegistrationModule)
  },
  {
    path: 'auth/login',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.module').then((m) => m.MapModule)
  },
  {
    path: 'my-audio',
    loadChildren: () => import('./features/my-audio/my-audio.module').then((m) => m.MyAudioModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./features/favorites/favorites.module').then((m) => m.FavoritesModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then((m) => m.CartModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
  },
  {
    path: 'poi/:id',
    loadChildren: () => import('./features/poi-detail/poi-detail.module').then((m) => m.PoiDetailModule)
  },
  {
    path: 'player/:id',
    data: { hideBottomNav: true },
    loadChildren: () => import('./features/player/player.module').then((m) => m.PlayerModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

