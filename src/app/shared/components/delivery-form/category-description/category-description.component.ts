import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-description',
  templateUrl: './category-description.component.html',
  styles: [
  ]
})
export class CategoryDescriptionComponent implements OnInit {
@Input() selectedCategory: Category
  constructor() { }

  ngOnInit(): void {
  }

}
