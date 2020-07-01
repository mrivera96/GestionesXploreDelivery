import {User} from "./user";
import {Delivery} from "./delivery";
import {State} from "./state";

export interface DeliveryDetail {
  idDelivery?: number
  idDetalle?: number
  nFactura?: string
  nomDestinatario?: string
  numCel?: string
  direccion?: string
  distancia?: string
  entregado?: boolean
  fechaEntrega?: string
  nomRecibio?: string
  idConductor?: number
  conductor?: User
  tarifaBase?: number
  recargo?: number
  cTotal?: number
  instrucciones?: string
  delivery?: Delivery
  estado?: State
  idEstado?: number
}
