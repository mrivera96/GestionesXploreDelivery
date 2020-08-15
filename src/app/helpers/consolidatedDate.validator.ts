import {FormGroup} from "@angular/forms";
import {formatDate} from "@angular/common";
import {Schedule} from "../models/schedule";

export function ConsolidatedDateValidate(controlName: string, control2Name: string) {

  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName]
    const control2 = formGroup.controls[control2Name]
    const date = control.value
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en')
    const currentDateTime = new Date()
    let hour = control2.value
    /*const shour = hour.split(":")[0]
    const smin = hour.split(":")[1]
    hour = formatDate(new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
      null, shour, smin), 'HH:mm', 'en')*/
    const datetime = new Date(date + ' ' + hour)

    if (control.errors && !control.errors.mustAfterDate) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    if (control2.errors && !control2.errors.mustAfterHour) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (datetime < currentDateTime) {
      control2.setErrors({mustAfterHour: true})
    }

    if (date < currentDate) {
      control.setErrors({mustAfterDate: true})
    }

  }

}
