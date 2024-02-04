import { useMemo } from 'react'
import { AxiosError } from 'axios'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from 'react-query'
import {
   Row,
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table'

import {
   ActionIcon,
   Anchor,
   Badge,
   Flex,
   Rating,
   Table,
   Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { deleteWish } from '@/queries'
import type { WishListItem } from '@/types'
import { calculatePercentDifference, currencyFormatter } from '@/utils'

const columnHelper = createColumnHelper<WishListItem>()

const COLUMNS = [
   columnHelper.accessor('title', {
      size: 260,
      header: () => <Text size="xs">Title</Text>,
      cell: props => (
         <Text size="xs" truncate="end">
            {props.getValue()}
         </Text>
      ),
   }),
   columnHelper.accessor('url', {
      size: 240,
      header: () => <Text size="xs">URL</Text>,
      cell: props => {
         const value = props.getValue()
         return (
            <Anchor
               href={value}
               title={value}
               target="_blank"
               underline="never"
               rel="noopener noreferrer">
               <Text size="xs" truncate="end" c="blue">
                  {value}
               </Text>
            </Anchor>
         )
      },
   }),
   columnHelper.accessor('rating', {
      size: 100,
      header: () => (
         <Flex justify="center">
            <Text size="xs">Rating</Text>
         </Flex>
      ),
      cell: props => (
         <Flex justify="center">
            <Rating
               size="xs"
               readOnly
               fractions={2}
               defaultValue={props.getValue()}
            />
         </Flex>
      ),
   }),
   columnHelper.accessor('domain', {
      size: 180,
      header: () => <Text size="xs">Domain</Text>,
      cell: props => {
         const value = props.getValue()
         return (
            <Anchor
               target="_blank"
               underline="never"
               title={value}
               rel="noopener noreferrer"
               href={`https://www.${value}`}>
               <Text size="xs" truncate="end" c="blue">
                  {value}
               </Text>
            </Anchor>
         )
      },
   }),
   columnHelper.accessor('status', {
      size: 110,
      header: () => <Text size="xs">Status</Text>,
      cell: props => (
         <Badge variant="default" color="blue" size="sm">
            {props.getValue()}
         </Badge>
      ),
   }),
   columnHelper.accessor('amount', {
      size: 100,
      header: () => (
         <Text size="xs" ta="right">
            Amount
         </Text>
      ),
      cell: props => (
         <Text size="xs" ta="right">
            {currencyFormatter(props.getValue())}
         </Text>
      ),
   }),
   columnHelper.accessor('purchase_amount', {
      size: 140,
      header: () => (
         <Text size="xs" ta="right">
            Purchase Amount
         </Text>
      ),
      cell: props => {
         const final = props.getValue()
         const start = props.row.original.amount

         return (
            <Text size="xs" ta="right">
               {currencyFormatter(final)}
               {!!final && !!start
                  ? `(${final > start ? '+' : '-'}${calculatePercentDifference(start, final)}%)`
                  : null}
            </Text>
         )
      },
   }),
   columnHelper.accessor('purchase_date', {
      size: 110,
      header: () => (
         <Text size="xs" ta="right">
            Purchase Date
         </Text>
      ),
      cell: props => (
         <Text size="xs" ta="right">
            {props.getValue()}
         </Text>
      ),
   }),
]

const RowActions = ({ row }: { row: Row<WishListItem> }) => {
   const queryClient = useQueryClient()
   const { mutate } = useMutation({
      mutationFn: deleteWish,
      onError: error => {
         notifications.show({
            title: 'Error',
            message: (error as AxiosError).message,
         })
      },
      onSuccess: () => {
         queryClient.invalidateQueries('wishes')
      },
   })
   return (
      <ActionIcon
         size="sm"
         color="gray"
         variant="subtle"
         title="Delete Wish"
         onClick={() => mutate(row.original.id)}>
         <IconTrash size={14} stroke={2} />
      </ActionIcon>
   )
}

const ActionColumn = columnHelper.display({
   size: 60,
   id: 'actions',
   meta: {
      className: 'sticky',
   },
   cell: props => (
      <Flex justify="center">
         <RowActions row={props.row} />
      </Flex>
   ),
})

const Results = ({ data }: { data: WishListItem[] }) => {
   const columns = useMemo(() => [...COLUMNS, ActionColumn], [])
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   })
   return (
      <Table.ScrollContainer minWidth={500} mt={16}>
         <Table layout="fixed" striped withTableBorder withColumnBorders>
            <Table.Thead>
               {table.getHeaderGroups().map(headerGroup => (
                  <Table.Tr key={headerGroup.id}>
                     {headerGroup.headers.map(header => (
                        <Table.Th
                           key={header.id}
                           className={header.column.columnDef.meta?.className}
                           style={{
                              width:
                                 header.getSize() === 150
                                    ? 'auto'
                                    : header.getSize(),
                           }}>
                           {header.isPlaceholder
                              ? null
                              : flexRender(
                                   header.column.columnDef.header,
                                   header.getContext()
                                )}
                        </Table.Th>
                     ))}
                  </Table.Tr>
               ))}
            </Table.Thead>
            <Table.Tbody>
               {table.getRowModel().rows.map((row, index) => (
                  <Table.Tr key={row.id}>
                     {row.getVisibleCells().map(cell => {
                        const size = cell.column.getSize()
                        const columnDef = cell.column.columnDef
                        return (
                           <Table.Td
                              key={cell.id}
                              className={`${columnDef.meta?.className} ${index % 2 === 0 ? 'sticky_even' : 'sticky_odd'}`}
                              style={{
                                 width: size === 150 ? 'auto' : size,
                              }}>
                              {flexRender(columnDef.cell, cell.getContext())}
                           </Table.Td>
                        )
                     })}
                  </Table.Tr>
               ))}
            </Table.Tbody>
         </Table>
      </Table.ScrollContainer>
   )
}

export default Results
