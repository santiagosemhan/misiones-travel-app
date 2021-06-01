import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MtSlideButtonLoadingComponent } from './mt-slide-button-loading.component';

describe('MtSlideButtonLoadingComponent', () => {
  let component: MtSlideButtonLoadingComponent;
  let fixture: ComponentFixture<MtSlideButtonLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtSlideButtonLoadingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MtSlideButtonLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
