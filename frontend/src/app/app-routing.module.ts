import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    data: { hideBottomNav: true },
    loadChildren: () => import('./features/splash/splash.module').then((m) => m.SplashModule)
  },
  {
    path: 'welcome',
    data: { hideBottomNav: true },
    loadChildren: () => import('./features/welcome/welcome.module').then((m) => m.WelcomeModule)
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
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

