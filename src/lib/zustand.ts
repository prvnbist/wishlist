import { create } from 'zustand'

import type { Sort, WishListItem } from '@/types'

interface GlobalState {
   sort: Sort[]
   setSort: (value: Sort, op: 'add' | 'remove') => void
}

const useGlobalStore = create<GlobalState>(set => ({
   sort: [],
   setSort: (value: Sort, op: 'add' | 'remove') =>
      set(state => {
         if (op === 'add') {
            const sort = [...state.sort]

            const index = sort.findIndex(s => s.column === value.column)
            if (index !== -1) {
               sort[index] = value
               return { sort }
            }

            return { sort: [...sort, value] }
         }
         return { sort: state.sort.filter(c => c.column !== value.column) }
      }),
}))

export default useGlobalStore
