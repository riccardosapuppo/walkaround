import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAudioComponent } from './my-audio.component';

const routes: Routes = [
  {
    path: '',
    component: MyAudioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAudioRoutingModule {}

