import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MyAudioRoutingModule } from './my-audio-routing.module';
import { MyAudioComponent } from './my-audio.component';

@NgModule({
  declarations: [MyAudioComponent],
  imports: [SharedModule, MyAudioRoutingModule]
})
export class MyAudioModule {}

