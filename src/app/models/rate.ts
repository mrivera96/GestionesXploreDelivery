import {Category} from "./category";

export interface Rate {
  idTarifaDelivery?: number
  idCategoria?: number
  entregasMinimas?: number
  entregasMaximas?: number
  precio?: number
  category?: Category
}
