import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {BranchService} from "../../../services/branch.service";
import {Branch} from "../../../models/branch";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";

@Component({
  selector: 'app-customer-branch-offices',
  templateUrl: './customer-branch-offices.component.html',
  styleUrls: ['./customer-branch-offices.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerBranchOfficesComponent implements OnInit {
  loaders = {
    'loadingData': false
  }
  bdtTrigger: Subject<any> = new Subject()
  bdtOptions
  myBranchOffices: Branch[]
  curUser: User

  constructor(private branchService: BranchService,
              private authService: AuthService) {
    this.curUser = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.bdtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order:[2,'desc'],
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
    this.loadData()
  }

  loadData() {
    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
      this.bdtTrigger.next()
    })
  }

}
