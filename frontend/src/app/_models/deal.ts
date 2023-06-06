export interface Deal {
  id?:number,
  name?:string,
  description?:string,
  budget?:number,
  currency?:string,
  status?:string,
  company_id?:string,
  company_name?: string
  contact_point_id?: number
  contact_point_name?: string
}
