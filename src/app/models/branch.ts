import {Customer} from './customer';

export interface Branch {
  idSucursal?: number
  nomSucursal?: string
  numTelefono?: string
  direccion?: string
  cliente?: Customer
  instrucciones?: string
  isDefault?: boolean
}
