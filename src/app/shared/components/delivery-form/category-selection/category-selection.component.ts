import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styles: [
  ]
})
export class CategorySelectionComponent implements OnInit {
  @Input() categories: Category []
  @Input() newForm: any
  @Input() deliveryForm
  @Output('setSelectedCategory') setSelectedCategory: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  
  setSelectedCategoryFun(category){
    this.setSelectedCategory.emit(category)
  }

}
