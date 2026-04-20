import { Component } from '@angular/core';

interface NavItem {
  route: string;
  icon: string;
  labelKey: string;
}

@Component({
  standalone: false,
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  readonly items: NavItem[] = [
    { route: '/home', icon: 'home', labelKey: 'bottomNav.home' },
    { route: '/map', icon: 'map', labelKey: 'bottomNav.map' },
    { route: '/my-audio', icon: 'library_music', labelKey: 'bottomNav.audio' },
    { route: '/favorites', icon: 'favorite', labelKey: 'bottomNav.favorites' },
    { route: '/cart', icon: 'shopping_cart', labelKey: 'bottomNav.cart' },
    { route: '/profile', icon: 'person', labelKey: 'bottomNav.profile' }
  ];
}

