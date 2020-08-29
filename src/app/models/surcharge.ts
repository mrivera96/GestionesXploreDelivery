import {Customer} from "./customer";
import {Category} from "./category";

export interface Surcharge {
  idRecargo?: number
  descRecargo?: string
  kilomMinimo?: number
  kilomMaximo?: number
  monto?: number
  idCliente?: number
  idCategoria?: number
  customer?: Customer
  category?: Category
}
