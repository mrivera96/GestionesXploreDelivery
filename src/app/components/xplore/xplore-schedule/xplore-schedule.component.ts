import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {SchedulesService} from "../../../services/schedules.service";
import {Schedule} from "../../../models/schedule";
import {MatDialog} from "@angular/material/dialog";
import {EditScheduleDialogComponent} from "./edit-schedule-dialog/edit-schedule-dialog.component";

@Component({
  selector: 'app-xplore-schedule',
  templateUrl: './xplore-schedule.component.html',
  styleUrls: ['./xplore-schedule.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreScheduleComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  dtOptions
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }

  schedules: Schedule[]
  constructor(
    private schedulesService: SchedulesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize(){
    this.dtTrigger = new Subject<any>()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
      responsive: true,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
      },
    }
  }

  loadData(){
    this.loaders.loadingData = true
    this.schedulesService.getSchedule().subscribe(response => {
      this.schedules = response.data
      this.dtTrigger.next()
      this.loaders.loadingData = false
    })
  }

  showEditDialog(schedule){
    const dialogRef = this.dialog.open(EditScheduleDialogComponent,{
      data:{
        schedule: schedule
      }
    })

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })
  }
}
