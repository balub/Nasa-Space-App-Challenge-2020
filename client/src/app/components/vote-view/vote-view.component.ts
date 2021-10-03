import { SnackBarComponent } from './../snack-bar/snack-bar.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as data from '../../../assets/userdata.json';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vote-view',
  templateUrl: './vote-view.component.html',
  styleUrls: ['./vote-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VoteViewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'designation', 'action'];
  userList: any = (data as any).default;
  dataSource = this.userList;
  voteCountYes = 0;
  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    for (let i = 1; i < this.userList.length; i++) {
      if (this.userList[i].vote === 'Yes') {
        setTimeout(() => {
          if (this.userList[i].vote === 'Yes') {
            this.incrementVoteCount(this.userList[i]);
          }
        }, this.userList[i].timeout);
      } else {
        setTimeout(() => {
          if (this.userList[i].vote === 'No') {
            this.decrementVoteCount(this.userList[i]);
          }
        }, this.userList[i].timeout);
      }
    }
  }

  incrementVoteCount(user: any) {
    this.voteCountYes++;
    user.status = 'Voted';
    user.vote = 'Yes';
    this.evaluateVotes();
  }

  decrementVoteCount(user: any) {
    user.status = 'Voted';
    user.vote = 'No';
    this.evaluateVotes();
  }

  evaluateVotes() {
    if (this.voteCountYes >= 7) {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 7000,
      });

      // Call the actual function to send data to pager
    }
  }
}
