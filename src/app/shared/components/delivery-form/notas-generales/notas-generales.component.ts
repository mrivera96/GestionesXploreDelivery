import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-notas-generales',
  templateUrl: './notas-generales.component.html',
  styles: [
  ]
})
export class NotasGeneralesComponent implements OnInit {
  @Output() acceptTerms = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  changeAccepTerms(checked){
    this.acceptTerms.emit(checked)
  }

}
