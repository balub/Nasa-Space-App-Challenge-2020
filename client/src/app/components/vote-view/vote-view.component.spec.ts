import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteViewComponent } from './vote-view.component';

describe('VoteViewComponent', () => {
  let component: VoteViewComponent;
  let fixture: ComponentFixture<VoteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
