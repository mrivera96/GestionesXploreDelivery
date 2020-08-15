import { Rate } from './rate';

export interface Schedule {
  descHorario?: string
  idHorario?: number
  dia?: string
  inicio?: string
  final?: string
  cod?: number
  rate?: Rate
  finicio?: string
  ffinal?: string
}
