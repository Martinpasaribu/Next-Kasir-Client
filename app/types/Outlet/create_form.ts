
export interface CreateOutletForm  {
  name: string
  code: string
  description: string
  address: string
  email: string
  phone: number
  order: number
  icon: any | null 
  image_bg: any | null
  isActive: boolean
  location: {
    lat: string
    lng: string
    link: string
  }

}