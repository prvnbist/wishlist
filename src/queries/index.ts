import axios, { AxiosError } from 'axios'

import { Sort } from '@/types'

export const getList = async (sort: Sort[], search: string = '') => {
   try {
      const data = await axios.get('/api/list', {
         params: {
            ...(search.trim() && { search: search.trim() }),
            ...sort.reduce((acc: { [key in string]: 'asc' | 'desc' }, curr) => {
               acc[curr.column] = curr.direction
               return acc
            }, {}),
         },
      })

      return data.data.list
   } catch (error) {
      const _error = (error as AxiosError)?.response?.statusText
      throw Error(_error)
   }
}
