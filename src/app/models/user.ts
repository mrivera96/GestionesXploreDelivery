import {Agency} from "./agency";

export interface User {
  idUsuario?: number
  idCliente?: any
  idPerfil?: any
  nomUsuario?: string
  nickUsuario?: string
  passUsuario?: string
  isActivo?: boolean
  lastLogin?: any
  fechaCreacion?: any
  idAgencia?: any
  passcodeUsuario?: number
  access_token?: string
  cliente?: any
  numCelular?: string
  agency?: Agency
  state?: string
  permiteConsolidada?: boolean
  permiteConsolidadaForanea?: boolean
}
