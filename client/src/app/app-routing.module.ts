import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapViewComponent } from './components/map-view/map-view.component';
import { VoteViewComponent } from './components/vote-view/vote-view.component';

const routes: Routes = [
  {
    path: '',
    component: MapViewComponent,
  },
  {
    path: 'vote',
    component: VoteViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
