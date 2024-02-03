export type WishListItem = {
   id: string
   title: string
   url: string
   date: string
   amount: number
   rating: number
   domain: string
   purchase_date: string | null
   purchase_amount: number | null
   status: 'PENDING' | 'PURCHASED'
}

export interface Sort {
   column: keyof WishListItem
   direction: 'asc' | 'desc'
}
