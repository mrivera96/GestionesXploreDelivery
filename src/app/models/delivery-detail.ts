import {User} from "./user";
import {Delivery} from "./delivery";
import {State} from "./state";
import {ExtraCharge} from "./extra-charge";
import {ExtraChargeOption} from "./extra-charge-option";
import {Photography} from "./photography";
import {OrderExtraCharges} from "./order-extra-charges";

export interface DeliveryDetail {
  idDelivery?: number
  idDetalle?: number
  nFactura?: string
  nomDestinatario?: string
  numCel?: string
  direccion?: string
  distancia?: string
  tiempo?: string
  entregado?: boolean
  fechaEntrega?: string
  nomRecibio?: string
  idConductor?: number
  idAuxiliar?: number
  conductor?: User
  auxiliar?: User
  tarifaBase?: number
  recargo?: number
  cTotal?: number
  instrucciones?: string
  delivery?: Delivery
  estado?: State
  idEstado?: number
  observaciones?: string
  coordsDestino?: string
  cargosExtra?: number
  idCargoExtra?: number
  idDetalleOpcion?: number
  extra_charge_option?: ExtraChargeOption
  tomarFoto?: boolean
  photography?: Photography[]
  extra_charges?: OrderExtraCharges[]
  efectivoRecibido?: number
  order?: number
  idRecargo?: number
}
