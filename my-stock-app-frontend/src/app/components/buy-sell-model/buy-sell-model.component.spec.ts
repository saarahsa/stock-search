import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellModelComponent } from './buy-sell-model.component';

describe('BuySellModelComponent', () => {
  let component: BuySellModelComponent;
  let fixture: ComponentFixture<BuySellModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuySellModelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BuySellModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
