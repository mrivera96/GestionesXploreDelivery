import {PaymentType} from "./payment-type";
import {User} from "./user";
import {Customer} from "./customer";

export interface Payment {
  idPago?: number
  fechaPago?: string
  monto?: number
  tipoPago?: PaymentType
  idUsuario?: number
  user?: User
  idCliente?: number
  customer?: Customer
  referencia?: string
  banco?: string
  numAutorizacion?: string
  payment_type?: PaymentType
}
