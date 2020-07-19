import {Customer} from "./customer";

export interface Surcharge {
  idRecargo?: number
  descRecargo?: string
  kilomMinimo?: number
  kilomMaximo?: number
  monto?: number
  idCliente?: number
  customer?: Customer
}
