import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DisasterInfo } from './../../shared/models/disaster-info';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AlertModalComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DisasterInfo
  ) {}

  ngOnInit(): void {}

  actionNo() {
    this.dialogRef.close();
  }

  actionYes() {
    this.dialogRef.close();
    this.router.navigate(['vote']);
  }
}
