'use server'

import { Sort } from '@/types'
import supabase from '@/lib/supabase'
import { getFileExtension } from '@/utils'

export const wishes = async (sort: Sort[], search: string = '') => {
   const query = supabase.from('wishlist').select('*')

   if (search.trim()) {
      query.or(`title.ilike.%${search.trim()}%,domain.ilike.%${search.trim()}%`)
   }

   query.filter('is_archived', 'eq', false)

   sort.forEach(({ column, direction }) => {
      query.order(column, { ascending: direction === 'asc' })
   })

   const { error, data } = await query

   if (error) throw Error('Failed to fetch wishes, please refresh the page!')

   return { wishes: data }
}

export const addWish = async (form: FormData) => {
   const values: any = {}

   for (let [key, value] of form.entries()) {
      values[key] = ['rating', 'amount', 'purchase_amount'].includes(key)
         ? Number(value)
         : value
   }

   const { file, ...rest } = values

   const { data, error } = await supabase
      .from('wishlist')
      .insert([rest])
      .select()

   if (error) {
      throw new Error('Failed to create a wish, please try again!')
   }

   const [row] = data

   if (file) {
      const form = new FormData()
      form.append('file', file)
      const url = await uploadFile(form, row.id)
      if (url) {
         try {
            await updateWish(row.id, { image_url: url })
         } catch (error) {}
      }
   }

   return { wish: row }
}

export const updateWish = async (id: string, values: any) => {
   const { data, error } = await supabase
      .from('wishlist')
      .update(values)
      .eq('id', id)
      .select()

   if (error) {
      throw Error('Failed to update the wish, please try again!')
   }

   return { wish: data?.[0] }
}

export const deleteWish = async (id: string) => {
   try {
      await updateWish(id, { is_archived: true })
   } catch (error) {
      throw new Error('Failed to delete the wish, please try again!')
   }

   return { wish: { id } }
}

export const uploadFile = async (form: FormData, id: string) => {
   const file = form.get('file') as File

   const query = supabase.storage.from('wishlist')

   const extenstion = getFileExtension(file?.name)
   const path = `images/${id}.${extenstion}`
   const { data, error } = await query.upload(path, file)

   if (error || !data?.path) return null

   const response = await query.getPublicUrl(data.path)
   return response.data.publicUrl
}
