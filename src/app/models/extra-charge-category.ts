import { Category } from './category';
import {ExtraCharge} from "./extra-charge";

export interface ExtraChargeCategory {
    idCategoria?: number
    idCargoExtra?: number
    category?: Category
    extra_charge?: ExtraCharge
}
