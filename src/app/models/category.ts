import {ExtraChargeCategory} from "./extra-charge-category";
import {Rate} from "./rate";
import { Surcharge } from './surcharge';

export interface Category {
  idCategoria?: number
  descCategoria?: string
  isActivo?: boolean
  descripcion?: string
  categoryExtraCharges?: ExtraChargeCategory[]
  ratesToShow?: Rate[]
  surcharges?: Surcharge[]
  idTipoServicio?: number
  datesToShow?: any[]
}
