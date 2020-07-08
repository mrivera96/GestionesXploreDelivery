import {SchedulesService} from "../services/schedules.service";

export class GlobalConstants {
  public static todaySchedule
  constructor(
    private schedulesService: SchedulesService
  ) {
    GlobalConstants.todaySchedule = this.schedulesService.getSchedule().pipe()
  }
}
