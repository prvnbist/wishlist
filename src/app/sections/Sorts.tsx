import { Group, Pill } from '@mantine/core'

import useGlobalStore from '@/lib/zustand'

const Sorts = () => {
   const [sort, setSort] = useGlobalStore(state => [state.sort, state.setSort])

   if (sort.length === 0) return null
   return (
      <Group gap={8} mt={16}>
         {sort.map(s => (
            <Pill
               bg="dark.6"
               radius="sm"
               key={s.column}
               withRemoveButton
               onRemove={() => setSort(s, 'remove')}>
               {s.column} ({s.direction})
            </Pill>
         ))}
      </Group>
   )
}

export default Sorts
