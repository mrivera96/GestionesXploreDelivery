import {User} from "./user";

export interface DeliveryDetail {
  idDelivery?: number
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
}
