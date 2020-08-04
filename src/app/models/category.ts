import {ExtraChargeCategory} from "./extra-charge-category";

export interface Category {
  idCategoria?: number
  descCategoria?: string
  isActivo?: boolean
  descripcion?: string
  category_extra_charges?: ExtraChargeCategory[]
}
