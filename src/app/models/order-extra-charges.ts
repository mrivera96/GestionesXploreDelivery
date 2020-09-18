import {ExtraCharge} from "./extra-charge";
import {ExtraChargeOption} from "./extra-charge-option";

export interface OrderExtraCharges {
  id?: number
  idDetalle?: number
  idCargoExtra?: number
  idDetalleOpcion?: number
  extracharge?: ExtraCharge
  option?: ExtraChargeOption
}
