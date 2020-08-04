import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Photography} from "../../../models/photography";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-view-photos-dialog',
  templateUrl: './view-photos-dialog.component.html',
  styleUrls: ['./view-photos-dialog.component.css']
})
export class ViewPhotosDialogComponent implements OnInit {

  photos: Photography[] = []
  imageRoute: string
  constructor(
    public dialogRef: MatDialogRef<ViewPhotosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.photos = this.data.photos
  }

  ngOnInit(): void {
    this.imageRoute = environment.appConductores
  }

}
