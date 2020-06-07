import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {formatDate} from "@angular/common";

export function DateValidate(controlName: string) {

  return (formGroup: FormGroup)=> {
    const control = formGroup.controls[controlName]
    let date = control.value
    if (control.errors && !control.errors.mustAfterDate) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if(control.value < formatDate(new Date(), 'yyyy-MM-dd', 'en')){
      control.setErrors({ mustAfterDate: true })
    }

  }

}
