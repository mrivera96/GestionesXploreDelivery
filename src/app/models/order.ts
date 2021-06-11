import {State} from "./state";
import {User} from "./user";
import {Delivery} from "./delivery";
import {Photography} from "./photography";
import { ExtraCharge } from './extra-charge';
import {OrderExtraCharges} from "./order-extra-charges";

export interface Order {
  idDetalle?: number
  idDelivery?: number
  nFactura?: string
  nomDestinatario?: string
  numCel?: string
  direccion?: string
  distancia?: string
  tiempo?: string
  estado?: State
  conductor?: User
  auxiliar?: User
  tarifaBase?: number
  recargo?: number
  cTotal?: number
  instrucciones?: string
  fechaEntrega?: Date
  delivery?: Delivery
  idEstado?: number
  idConductor?: number
  idAuxiliar?: number
  observaciones?: string
  coordsDestino?: string
  cargosExtra?: number
  tomarFoto?: boolean
  photography?: Photography[]
  extra_charges?: OrderExtraCharges[]
  time?: any
  efectivoRecibido?: number
  order?: number
  idRecargo?: number
}
