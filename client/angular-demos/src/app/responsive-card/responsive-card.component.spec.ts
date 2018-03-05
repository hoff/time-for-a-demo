import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveCardComponent } from './responsive-card.component';

describe('ResponsiveCardComponent', () => {
  let component: ResponsiveCardComponent;
  let fixture: ComponentFixture<ResponsiveCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
