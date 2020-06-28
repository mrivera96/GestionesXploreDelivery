import {DeliveryDetail} from "./delivery-detail";
import {Category} from "./category";

export interface Delivery {
  idDelivery?: number
  nomCliente?: string
  numIdentificacion?: string
  numCelular?: string
  fechaReserva?: string
  dirRecogida?: string
  email?: string
  idCategoria?: string
  idEstado?: number
  estado?: any
  detalle?: DeliveryDetail[]
  category?: Category
  tarifaBase?: number
  recargos?: number
  total?: number
  isPagada?: boolean
  idCliente?: number
  entregas?: number
  instrucciones?: string
  cantidad?: string
  descCategoria?: string
}
