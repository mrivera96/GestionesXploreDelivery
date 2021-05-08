import {FormGroup} from "@angular/forms";
import {formatDate} from "@angular/common";

export function DateValidate(controlName: string) {

  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName]
    const date = control.value
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en')

    if (control.errors && !control.errors.mustAfterDate) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (date < currentDate) {
      control.setErrors({mustAfterDate: true})
    }

  }

}
