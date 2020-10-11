import {Customer} from "./customer";

export interface ReportRequest {
  id?: number
  idCliente?: number
  idUsuario?: number
  customer?: Customer
  fechaRegistro?: string
  correo?: string
}
