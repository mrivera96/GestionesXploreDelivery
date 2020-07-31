import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {DatePipe} from "@angular/common";
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private datePipe: DatePipe
  ) { }


}
