import {Category} from "./category";
import {Customer} from "./customer";
import { RateType } from './rate-type';
import {ConsolidatedRateDetail} from "./consolidated-rate-detail";
import {Schedule} from "./schedule";
import {ItemDetail} from "./item-detail";

export interface Rate {
  idTarifaDelivery?: number
  descTarifa?: string
  idCategoria?: number
  entregasMinimas?: number
  entregasMaximas?: number
  precio?: number
  idCliente?: number
  category?: Category
  cliente?: Customer
  rate_type?: RateType
  idTipoTarifa?: number
  consolidated_detail?: ConsolidatedRateDetail
  schedules?: Schedule[]
  rate_detail?: any[]
  datesToShow?: any[]
  item_detail?: ItemDetail
}
