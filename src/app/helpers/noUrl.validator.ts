import {FormGroup} from "@angular/forms";

export function NoUrlValidator(controlName: string) {

  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName]
    let value = control?.value
    if (typeof (value) == "number") {

    } else {
      if (control.errors && !control.errors.isUrl) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      if ((value != null && value.includes('https://')) || (value != null && value.includes('http://'))) {
        control.setErrors({isUrl: true})
      }
    }


  }

}
