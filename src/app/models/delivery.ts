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
  estado?: any
  detalle?: DeliveryDetail[]
  category?: Category
  tarifaBase?: number
  recargos?: number
  total?: number
  isPagada?: boolean
}
