import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PoiDetailRoutingModule } from './poi-detail-routing.module';
import { PoiDetailComponent } from './poi-detail.component';

@NgModule({
  declarations: [PoiDetailComponent],
  imports: [SharedModule, PoiDetailRoutingModule]
})
export class PoiDetailModule {}

