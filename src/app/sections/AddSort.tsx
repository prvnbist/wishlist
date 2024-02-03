'use client'

import { useState } from 'react'
import { IconArrowsSort } from '@tabler/icons-react'

import {
   Button,
   Group,
   Input,
   Popover,
   Radio,
   Select,
   Space,
} from '@mantine/core'

import type { WishListItem } from '@/types'

import useGlobalStore from '@/lib/zustand'

const AddSort = () => {
   const setSort = useGlobalStore(state => state.setSort)

   const [column, setColumn] = useState<keyof WishListItem | null>(null)
   const [direction, setDirection] = useState<'asc' | 'desc'>('asc')

   const apply = () => {
      if (!column) return

      setSort({ column, direction }, 'add')

      setColumn(null)
      setDirection('asc')
   }
   return (
      <Popover width={280} shadow="md" position="bottom-start">
         <Popover.Target>
            <Button
               size="xs"
               variant="default"
               leftSection={<IconArrowsSort size={16} />}>
               Sort
            </Button>
         </Popover.Target>
         <Popover.Dropdown>
            <Input.Label size="xs">Column</Input.Label>
            <Select
               size="xs"
               clearable
               searchable
               value={column}
               placeholder="Select column"
               nothingFoundMessage="No such column..."
               comboboxProps={{ withinPortal: false }}
               onChange={value => setColumn(value as keyof WishListItem)}
               data={[
                  { value: 'date', label: 'Date' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'domain', label: 'Domain' },
                  { value: 'status', label: 'Status' },
                  { value: 'purchase_date', label: 'Purchase Date' },
                  {
                     value: 'purchase_amount',
                     label: 'Purchase Amount',
                  },
               ]}
            />
            <Space h={8} />
            <Input.Label size="xs">Direction</Input.Label>
            <Radio.Group
               size="xs"
               name="direction"
               value={direction}
               onChange={value => setDirection(value as 'asc' | 'desc')}>
               <Group mt="xs">
                  <Radio value="asc" label="Asc" size="xs" />
                  <Radio value="desc" label="Desc" size="xs" />
               </Group>
            </Radio.Group>
            <Space h={16} />
            <Button
               fullWidth
               variant="light"
               onClick={apply}
               disabled={!column}>
               Apply
            </Button>
         </Popover.Dropdown>
      </Popover>
   )
}

export default AddSort
