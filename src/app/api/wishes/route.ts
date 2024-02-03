import supabase from '@/lib/supabase'

export async function POST(request: Request) {
   const body = await request.json()

   const { data, error } = await supabase
      .from('wishlist')
      .insert([body])
      .select()

   if (error) {
      return Response.json(null, {
         status: 500,
         statusText: 'Unable to save the wish, please try agian!',
      })
   }

   return Response.json({ data })
}

export async function GET(request: Request) {
   const urlParams = new URLSearchParams(new URL(request.url).search)

   const params = [...urlParams.entries()]

   const query = supabase.from('wishlist').select('*')

   const search = urlParams.get('search')

   if (search) {
      query.or(`title.ilike.%${search.trim()}%,domain.ilike.%${search.trim()}%`)
   }

   params.forEach(([key, value]) => {
      if (key === 'search') return
      query.order(key, { ascending: value === 'asc' })
   })

   const response = await query

   if (response.error?.code) {
      return Response.json(null, {
         status: 500,
         statusText: 'Unable to fetch the wishes, please try again!',
      })
   }

   return Response.json({ list: response.data ?? [] })
}
