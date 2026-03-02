import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SplashRoutingModule } from './splash-routing.module';
import { SplashComponent } from './splash.component';

@NgModule({
  declarations: [SplashComponent],
  imports: [SharedModule, SplashRoutingModule]
})
export class SplashModule {}

