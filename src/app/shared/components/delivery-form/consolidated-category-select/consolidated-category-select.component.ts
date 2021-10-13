import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-consolidated-category-select',
  templateUrl: './consolidated-category-select.component.html',
  styles: [
  ]
})
export class ConsolidatedCategorySelectComponent implements OnInit {
  @Input() categories: Category []
  @Input() newForm: any
  @Output('setSelectedCategory') setSelectedCategory: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  setSelectedCategoryFun(category){
    this.setSelectedCategory.emit(category)
  }

}
