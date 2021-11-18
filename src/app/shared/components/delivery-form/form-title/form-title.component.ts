import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-title',
  templateUrl: './form-title.component.html',
  styles: [
  ]
})
export class FormTitleComponent implements OnInit {
  @Input() title: string
  constructor() { }

  ngOnInit(): void {
  }

}
