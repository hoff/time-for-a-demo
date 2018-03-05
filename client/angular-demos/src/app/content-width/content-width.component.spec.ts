import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWidthComponent } from './content-width.component';

describe('ContentWidthComponent', () => {
  let component: ContentWidthComponent;
  let fixture: ComponentFixture<ContentWidthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentWidthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentWidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
