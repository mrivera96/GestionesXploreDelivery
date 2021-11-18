import { FormGroup } from "@angular/forms";

export function NickNameValidator(controlName: string) {

  return (formGroup: FormGroup)=> {
    const control = formGroup.controls[controlName]
    let value = control?.value
    if (control.errors && !control.errors.required) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      if(value != null && value?.includes(' ')){
        control.setErrors({ hasSpace: true })
      }


  }

}
