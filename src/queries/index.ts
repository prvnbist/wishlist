import axios, { AxiosError } from 'axios'

import { Sort } from '@/types'

export const wishes = async (sort: Sort[], search: string = '') => {
   try {
      const data = await axios.get('/api/wishes', {
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

export const addWish = async (values: any) => {
   try {
      const data = await axios.post('/api/wishes', values)

      return data
   } catch (error) {
      const _error = (error as AxiosError)?.response?.statusText
      throw Error(_error)
   }
}

export const deleteWish = async (id: string) => {
   try {
      const data = await axios.delete('/api/wishes', {
         data: { id },
      })

      return data
   } catch (error) {
      const _error = (error as AxiosError)?.response?.statusText
      throw Error(_error)
   }
}
