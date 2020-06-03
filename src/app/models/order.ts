import {State} from "./state";
import {User} from "./user";

export interface Order {
  idDetalle?: number
  idDelivery?: number
  nFactura?: string
  nomDestinatario?: string
  numCel?: string
  direccion?: string
  distancia?: string
  estado?: State
  conductor?: User
  tarifaBase?: number
  recargo?: number
  cTotal?: number
}
