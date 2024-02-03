import supabase from '@/lib/supabase'

export async function GET(request: Request) {
   const urlParams = new URLSearchParams(new URL(request.url).search)

   const params = [...urlParams.entries()]

   const query = supabase.from('wishlist').select('*')

   params.forEach(([key, value]) => {
      query.order(key, { ascending: value === 'asc' })
   })

   const response = await query

   if (response.error?.code) {
      return Response.json(null, {
         status: 500,
         statusText: 'Something went wrong, please try again!',
      })
   }

   return Response.json({ list: response.data ?? [] })
}
