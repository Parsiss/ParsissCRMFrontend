import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  id: string;

  constructor(
    route: ActivatedRoute
  ) {
    route.params.subscribe(params => {
      this.id = params['id'];
    });
  }


  ngOnInit(): void {

  }

}
