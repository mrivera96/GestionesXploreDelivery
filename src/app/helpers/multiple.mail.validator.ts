import {FormGroup,} from "@angular/forms";

export function MultipleMailValidator(controlName: string) {

  return (formGroup: FormGroup)=> {
    const control = formGroup.controls[controlName]
    let pattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
    let value = control?.value
    let mails = value.split(',').map(e=>e.trim())
    let err = 0

    if (control.errors && !control.errors.required) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    mails.some(mail => {

      if(mail.validator != null && pattern.match(pattern) != null){
        err ++
      }
    })

    if(err > 0){
      control.setErrors({ required: true })
    }

  }

}
