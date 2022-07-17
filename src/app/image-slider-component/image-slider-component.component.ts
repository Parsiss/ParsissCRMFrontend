import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider-component',
  templateUrl: './image-slider-component.component.html',
  styleUrls: ['./image-slider-component.component.scss']
})
export class ImageSliderComponentComponent implements OnInit {

  constructor() { }

  @Input() images: string[] = [];

  ngOnInit(): void {
  }

}
