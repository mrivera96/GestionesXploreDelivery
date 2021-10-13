import {ExtraChargeOption} from "./extra-charge-option";
import {ItemDetail} from "./item-detail";

export interface ExtraCharge {
  idCargoExtra?: number
  nombre?: string
  costo?: number
  tipoCargo?: string
  options?: ExtraChargeOption[]
  item_detail?: ItemDetail
}
