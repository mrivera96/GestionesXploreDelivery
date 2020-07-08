import {FormGroup} from "@angular/forms";
import {formatDate} from "@angular/common";
import {Schedule} from "../models/schedule";

export function DateValidate(controlName: string, control2Name: string) {

  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName]
    const control2 = formGroup.controls[control2Name]
    const date = control.value
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en')
    const currentDateTime = new Date()
    const todaySchedule: Schedule = JSON.parse(localStorage.getItem('todaySchedule'))
    const tSSHour = formatDate( new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
      null, Number(todaySchedule?.inicio.split(':')[0]), Number(todaySchedule?.inicio.split(':')[1]) ),
      'HH:mm', 'en')
    const tSFHour = formatDate(new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
      null, Number(todaySchedule?.final.split(':')[0]), Number(todaySchedule?.final.split(':')[1]) ),
      'HH:mm', 'en')
    let hour = control2.value
    const shour = hour.split(":")[0]
    const smin = hour.split(":")[1]
    hour = formatDate(new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),
      null, shour, smin), 'HH:mm', 'en')
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

    if (hour < tSSHour
      || hour > tSFHour) {
      control2.setErrors({mustAfterHour: true})
    }

  }

}
