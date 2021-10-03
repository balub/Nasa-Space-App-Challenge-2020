import { SocketIoService } from 'src/app/shared/services/socket-io.service';
import { SnackBarComponent } from './../snack-bar/snack-bar.component';
import { Component, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
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
  constructor(
    private _snackBar: MatSnackBar,
    private socketIoService: SocketIoService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
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

  initializeComponent() {
    this.voteCountYes = 0;
    for (const user of this.userList) {
      user.voted = undefined;
      user.status = undefined;
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

  async evaluateVotes() {
    if (this.voteCountYes >= 7 && this.socketIoService.getMessage()) {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 7000,
      });
      await this.sendMessageToPager();
    }
  }

  async sendMessageToPager() {
    fetch('http://5cb1-103-161-57-85.ngrok.io/send-message', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg: this.socketIoService.getMessage() }),
    });
  }
}
