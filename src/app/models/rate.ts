import {Category} from "./category";
import {Customer} from "./customer";

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
}
