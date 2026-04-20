import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { PoiMapSheetComponent } from './components/poi-map-sheet/poi-map-sheet.component';
import { DurationLabelPipe } from './pipes/duration-label.pipe';
import { ImgFallbackDirective } from './directives/img-fallback.directive';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [PoiMapSheetComponent, DurationLabelPipe, ImgFallbackDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, TranslatePipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PoiMapSheetComponent,
    DurationLabelPipe,
    ImgFallbackDirective,
    TranslatePipe
  ]
})
export class SharedModule {}

