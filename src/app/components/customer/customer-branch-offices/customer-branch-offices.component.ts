import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {BranchService} from "../../../services/branch.service";
import {Branch} from "../../../models/branch";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {MatDialog} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {EditDialogComponent} from "./edit-dialog/edit-dialog.component";
import {CustomerNewBranchComponent} from "../customer-new-branch/customer-new-branch.component";

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
    loadingData: false,
    loadingSubmit: false
  }
  bdtTrigger: Subject<any> = new Subject()
  bdtOptions
  myBranchOffices: Branch[]
  curUser: User
  confMsg = ''

  branchToDelete = null

  constructor(private branchService: BranchService,
              private authService: AuthService,
              public dialog: MatDialog
  ) {
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
      order: [2, 'desc'],
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
    this.loaders.loadingData = true
    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
      this.loaders.loadingData = false
      this.bdtTrigger.next()
    })
  }

  showEditForm(id) {
    let currBranch: Branch = {}
    this.myBranchOffices.forEach(value => {
      if (value.idSucursal === id) {
        currBranch = value
      }
    })
    this.openEditDialog(currBranch)
  }

  openEditDialog(branch) {
    this.dialog.open(EditDialogComponent, {
      data: {
        branch: branch
      }
    })
  }

  reloadData() {
    location.reload(true)
  }

  showConfirmDelete(id) {
    let currBranch: Branch = {}

    this.myBranchOffices.forEach(value => {
      if (value.idSucursal === id) {
        currBranch = value
      }
    })
    this.branchToDelete = currBranch.idSucursal
    this.confMsg = '¿Estás seguro de eliminar la dirección ' + currBranch.nomSucursal + '?'
    this.openConfirmDialog(id, this.confMsg)
  }
  showNewForm(){
    this.dialog.open(CustomerNewBranchComponent)
  }

  openConfirmDialog(id, msg) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        branchToDelete: id,
        confMsg: msg
      }
    })
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.reloadData()
      })
    }

  }

}
