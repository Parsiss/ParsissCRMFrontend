import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderComponentComponent } from './image-slider-component.component';

describe('ImageSliderComponentComponent', () => {
  let component: ImageSliderComponentComponent;
  let fixture: ComponentFixture<ImageSliderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSliderComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageSliderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
