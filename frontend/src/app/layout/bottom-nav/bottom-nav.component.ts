import { Component } from '@angular/core';

interface NavItem {
  route: string;
  icon: string;
  label: string;
}

@Component({
  standalone: false,
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  readonly items: NavItem[] = [
    { route: '/home', icon: 'home', label: 'Home' },
    { route: '/map', icon: 'map', label: 'Mappa' },
    { route: '/my-audio', icon: 'library_music', label: 'I miei audio' },
    { route: '/favorites', icon: 'favorite', label: 'Preferiti' },
    { route: '/profile', icon: 'person', label: 'Profilo' }
  ];
}

