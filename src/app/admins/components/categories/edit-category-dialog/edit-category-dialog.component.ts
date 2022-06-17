import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../services/categories.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { Category } from '../../../../models/category';
import { ServiceTypeService } from '../../../../services/service-type.service';
import { ServiceType } from '../../../../models/service-type';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css'],
})
export class EditCategoryDialogComponent implements OnInit {
  currCategory: Category;
  edCatForm: FormGroup;
  loaders = {
    loadingSubmit: false,
  };
  serviceTypes: ServiceType[];
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder:
      'Ingrese el texto que desea agregar como notas de la categoría....',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  constructor(
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private servTypesService: ServiceTypeService
  ) {
    this.currCategory = this.data.category;
    this.dialogRef.disableClose = true;
    if(this.currCategory?.notas){
      this.htmlContent = this.currCategory.notas
    }
  }

  ngOnInit(): void {
    this.loadData();
    this.edCatForm = new FormGroup({
      idCategoria: new FormControl(this.currCategory.idCategoria),
      descCategoria: new FormControl(this.currCategory.descCategoria, [
        Validators.required,
        Validators.maxLength(60),
      ]),
      descripcion: new FormControl(this.currCategory.descripcion, [
        Validators.required,
        Validators.maxLength(250),
      ]),
      isActivo: new FormControl(
        this.currCategory.isActivo,
        Validators.required
      ),
      idTipoServicio: new FormControl(
        this.currCategory?.idTipoServicio || null
      ),
      file: new FormControl(null),
      restKm: new FormControl(this.currCategory?.restKm, Validators.required),
      notas: new FormControl(this.currCategory?.notas),
      icono: new FormControl(this.currCategory?.icono)
    });
  }

  get f() {
    return this.edCatForm.controls;
  }

  loadData() {
    const servTypeSubs = this.servTypesService
      .getServiceTypes()
      .subscribe((response) => {
        this.serviceTypes = response.data;
        servTypeSubs.unsubscribe();
      });
  }

  onFormEditSubmit() {
    if (this.edCatForm.valid) {
      this.loaders.loadingSubmit = true;
      if (this.htmlContent != '') {
        this.edCatForm.controls.notas.setValue(this.htmlContent);
      }
      const categoriesSubscription = this.categoriesService
        .editCategory(this.edCatForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            categoriesSubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              categoriesSubscription.unsubscribe();
            });
          }
        );
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
    });
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  changeActive(checked) {
    if (checked) {
      this.f.isActivo.setValue(true);
    } else {
      this.f.isActivo.setValue(false);
    }
  }

  onSelect(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.edCatForm.get('file').setValue({
          filename: file.name,
          filetype: file.type,
          fileExtension: file.extension,
          filepath: file.path,
          //@ts-ignore
          value: reader.result.split(',')[1],
        });
      };
    }
  }
}
