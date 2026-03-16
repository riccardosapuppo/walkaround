import { NgModule } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { SharedModule } from '../../shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [SharedModule, LeafletModule, MapRoutingModule]
})
export class MapModule {}

