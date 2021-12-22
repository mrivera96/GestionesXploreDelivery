import {Payment} from "./payment";
import {Delivery} from "./delivery";

export interface Customer {
  idCliente?: number
  nomEmpresa?: string
  nomRepresentante?: string
  numIdentificacion?: string
  numTelefono?: string
  email?: string
  isActivo?: boolean
  subtotal?: number
  paid?: number
  montoGracia?: number
  balance?: number
  payments?: Payment[]
  deliveries?: Delivery[]
  subtotalShow?: string
  paidShow?: string
  balanceShow?: string
  enviarNotificaciones?: boolean
  instFotografias?: string
  idFrecuenciaFact?: number
  correosFact?: string
  razonSocial?: string
  rtn?: string
  pagoTarjeta?: boolean
  permiteEntregasConductor?: number
}
