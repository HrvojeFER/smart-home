import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArduinoConfComponent } from './arduino-conf.component';

describe('ArduinoConfComponent', () => {
  let component: ArduinoConfComponent;
  let fixture: ComponentFixture<ArduinoConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArduinoConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArduinoConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
