'use server'

import supabase from '@/lib/supabase'
import { getFileExtension } from '@/utils'

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
