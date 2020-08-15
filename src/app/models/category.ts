import {ExtraChargeCategory} from "./extra-charge-category";
import {Rate} from "./rate";

export interface Category {
  idCategoria?: number
  descCategoria?: string
  isActivo?: boolean
  descripcion?: string
  category_extra_charges?: ExtraChargeCategory[]
  rate?: Rate
  datesToShow?: any[]
}
