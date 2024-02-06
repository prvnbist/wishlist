import { useMemo } from 'react'
import { AxiosError } from 'axios'
import { IconPhoto, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from 'react-query'
import type { HeaderGroup } from '@tanstack/react-table'
import {
   Row,
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table'

import { modals } from '@mantine/modals'
import {
   ActionIcon,
   Anchor,
   Badge,
   Flex,
   Image,
   Rating,
   Table,
   Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'

import type { Wish } from '@/types'
import { deleteWish } from '@/actions'
import { calculatePercentDifference, currencyFormatter } from '@/utils'

const columnHelper = createColumnHelper<Wish>()

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
   columnHelper.accessor('image_url', {
      size: 56,
      header: () => <Text size="xs">Image</Text>,
      cell: props =>
         props.getValue() && (
            <Flex py={2} justify="center">
               <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() =>
                     modals.open({
                        title: 'Image Preview',
                        children: <Image alt="" src={props.getValue()} />,
                     })
                  }>
                  <IconPhoto size={14} />
               </ActionIcon>
            </Flex>
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

const RowActions = ({ row }: { row: Row<Wish> }) => {
   const queryClient = useQueryClient()
   const { mutate } = useMutation({
      mutationFn: deleteWish,
      onError: error => {
         notifications.show({
            title: 'Error',
            message: (error as Error).message,
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

const Results = ({ data }: { data: Wish[] }) => {
   const columns = useMemo(() => [...COLUMNS, ActionColumn], [])
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   })
   return (
      <Table.ScrollContainer minWidth={500} mt={16}>
         <Table layout="fixed" striped withTableBorder withColumnBorders>
            <THead headers={table.getHeaderGroups()} />
            <TBody rows={table.getRowModel().rows} />
         </Table>
      </Table.ScrollContainer>
   )
}

export default Results

const THead = ({ headers }: { headers: HeaderGroup<Wish>[] }) => {
   const [header] = headers
   return (
      <Table.Thead>
         <Table.Tr>
            {header.headers.map(header => {
               const size = header.getSize()
               return (
                  <Table.Th
                     key={header.id}
                     className={header.column.columnDef.meta?.className}
                     style={{
                        width: size === 150 ? 'auto' : size,
                     }}>
                     {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                     )}
                  </Table.Th>
               )
            })}
         </Table.Tr>
      </Table.Thead>
   )
}

const TBody = ({ rows }: { rows: Row<Wish>[] }) => {
   return (
      <Table.Tbody>
         {rows.map((row, index) => (
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
   )
}
