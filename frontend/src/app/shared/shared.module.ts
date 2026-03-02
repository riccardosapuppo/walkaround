import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { PoiMapSheetComponent } from './components/poi-map-sheet/poi-map-sheet.component';
import { DurationLabelPipe } from './pipes/duration-label.pipe';

@NgModule({
  declarations: [PoiMapSheetComponent, DurationLabelPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PoiMapSheetComponent,
    DurationLabelPipe
  ]
})
export class SharedModule {}

