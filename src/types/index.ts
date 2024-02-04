export type Wish = {
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
   column: keyof Wish
   direction: 'asc' | 'desc'
}
