export interface CreateProductForm  {

  name: string
  sku: string
  description: string
  sub_description: string
  category_key: string | null
  price_buy: number
  price_sell: number
  stock?: number
  order?: number
  min_stock_alert?: number
  icon: any | null 
  image_bg: any | null
  images: any[]
  unit: string
  recommend: boolean
  isActive: boolean
  isFree: boolean

}