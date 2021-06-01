import { ItemDetail } from "./item-detail";

export interface ExtraChargeOption {
  idDetalleOpcion?: number
  idCargoExtra?: number
  descripcion?: string
  costo?: number
  tiempo?: number
  montoCobertura?: number
  item_detail?: ItemDetail
}
