import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public minDate: Date;
  public dateValue: Date;

  constructor() {

  }


  ngOnInit(): void {

  }
}
