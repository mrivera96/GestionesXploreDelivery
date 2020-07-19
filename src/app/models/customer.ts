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
  balance?: number
  payments?: Payment[]
  deliveries?: Delivery[]
}
