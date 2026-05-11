export interface CreateCategoryForm  {

  name: string
  slug: string
  description: string
  ref_code: string
  sub_description: string
  order: number
  icon: any | null 
  image_bg: any | null
  images: any[]
  recommend: boolean
  isActive: boolean
  isFree: boolean

}