import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarkaprodiComponent } from './sidebarkaprodi.component';

describe('SidebarkaprodiComponent', () => {
  let component: SidebarkaprodiComponent;
  let fixture: ComponentFixture<SidebarkaprodiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarkaprodiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarkaprodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
