import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { VoteViewComponent } from './components/vote-view/vote-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavComponent,
    MapViewComponent,
    VoteViewComponent,
    AlertModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // Material Imports
    MatMenuModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
