import {ExtraChargeOption} from "./extra-charge-option";

export interface ExtraCharge {
  idCargoExtra?: number
  nombre?: string
  costo?: number
  tipoCargo?: string
  options?: ExtraChargeOption[]
}
