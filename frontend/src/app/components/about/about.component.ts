import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public minDate: Date = new Date();
  public dateValue: Date = new Date();

  ngOnInit(): void {
  }
}