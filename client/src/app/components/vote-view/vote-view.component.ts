import { Component, OnInit } from '@angular/core';
import * as data from '../../../assets/userdata.json';

@Component({
  selector: 'app-vote-view',
  templateUrl: './vote-view.component.html',
  styleUrls: ['./vote-view.component.scss']
})
export class VoteViewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'designation', 'action'];
  userList: any = (data as any).default;
  dataSource = this.userList;
  voteCount = 0;

  constructor() {}

  ngOnInit(): void {}

  incrementVoteCount(user: any) {
    this.voteCount++;
    user.status = 'Approved';
    if (this.voteCount >= 3) {
      console.log('Send Alert to Pager');
    }
  }
}
