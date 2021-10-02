import { AlertModalComponent } from './../alert-modal/alert-modal.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      width: '450px',
      data: { type: 'Tsunami', message: 'coming from backend' },
    });
  }
}
