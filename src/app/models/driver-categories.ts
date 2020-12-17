import { Category } from './category';
import { User } from './user';

export interface DriverCategories {
    idConductor?: number
    idCategoria?: number
    driver?: User
    category?: Category
}
