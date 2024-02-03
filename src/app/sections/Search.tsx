import { useEffect } from 'react'

import { Input } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'

import useGlobalStore from '@/lib/zustand'

const Search = () => {
   const setSearch = useGlobalStore(state => state.setSearch)

   const [value, setValue] = useDebouncedState('', 400)

   useEffect(() => {
      setSearch(value)
   }, [setSearch, value])

   return (
      <Input
         size="xs"
         defaultValue={value}
         placeholder="search you wishes..."
         onChange={e => setValue(e.currentTarget.value)}
      />
   )
}

export default Search
