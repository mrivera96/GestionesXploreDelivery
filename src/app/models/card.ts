import { Customer } from "./customer";

export interface Card {
    idFormaPago: number
    token_card: string
    mes?: number
    anio?: number
    cvv?: string
    idCliente?: number
    cliente?: Customer
    vencimiento?: string
    alias?: string
}
