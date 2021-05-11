import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CircuitosPage } from './circuitos.page';

describe('CircuitosPage', () => {
  let component: CircuitosPage;
  let fixture: ComponentFixture<CircuitosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircuitosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CircuitosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
