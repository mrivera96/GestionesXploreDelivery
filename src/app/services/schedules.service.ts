import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";
import {Schedule} from "../models/schedule";

import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private currentScheduleSubject: BehaviorSubject<Schedule>;
  public currentSchedule: Observable<Schedule>;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {

  }

  getSchedule(){
    return this.http.get<any>(`${environment.apiUrl}`,{params:{function:'getSchedule'} })
  }

  getTodaySchedule(): Schedule{
    const today = new Date().getDay()
    let todaySchedule = {}
    this.getSchedule().subscribe(response => {
      const schedules = response.data
      schedules.forEach(schedule => {
        if (schedule.cod == today) {
          todaySchedule = schedule

        }

      })
    })

    return todaySchedule

  }

  editSchedule(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'editSchedule',
      form ,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getShuttleSchedules(rate, date){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'getShuttleSchedules',
      rate,
      date
    })
  }
}
