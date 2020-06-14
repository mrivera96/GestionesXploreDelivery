import { FormGroup } from "@angular/forms";
import {formatDate} from "@angular/common";

export function HourValidate(controlName: string, control2Name: string) {

  return (formGroup: FormGroup)=> {
    const control = formGroup.controls[controlName]
    const control2 = formGroup.controls[control2Name]
    let date = control2.value
    let hour = control.value
    if (control.errors && !control.errors.mustAfterHour) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if(date == formatDate(new Date(), 'yyyy-MM-dd', 'en') && hour < formatDate(new Date(), 'HH:mm', 'en')){

      control.setErrors({ mustAfterHour: true })
    }

  }

}
