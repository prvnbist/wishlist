import axios, { AxiosError } from 'axios'

import { Sort } from '@/types'

export const getList = async (sort: Sort[]) => {
   try {
      const data = await axios.get('/api/list', {
         params: {
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
