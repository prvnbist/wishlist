import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import { IconPlus } from '@tabler/icons-react'
import { useMutation, useQueryClient } from 'react-query'

import {
   Button,
   Drawer,
   Group,
   Input,
   NumberInput,
   Rating,
   SegmentedControl,
   Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { addWish } from '@/queries'

const AddWish = () => {
   const [opened, { open, close }] = useDisclosure(false)
   return (
      <>
         <Button
            size="xs"
            onClick={open}
            variant="default"
            leftSection={<IconPlus size={16} />}>
            Add
         </Button>
         <Drawer
            offset={8}
            radius="md"
            opened={opened}
            onClose={close}
            title="Add Wish"
            position="right">
            <Form onSave={() => close()} />
         </Drawer>
      </>
   )
}

export default AddWish

const Form = ({ onSave }: { onSave: () => void }) => {
   const queryClient = useQueryClient()
   const { mutate } = useMutation({
      mutationFn: addWish,
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
   const form = useForm({
      initialValues: {
         title: '',
         url: '',
         rating: 0,
         amount: null,
         status: 'PENDING',
         purchase_amount: null,
         purchase_date: null,
      },
      transformValues: (values: Record<string, any>) => ({
         ...values,
         ...(values.purchase_date && {
            purchase_date: dayjs(values.purchase_date).format('YYYY-MM-DD'),
         }),
         ...(values.status === 'PENDING' && {
            purchase_date: null,
            purchase_amount: null,
         }),
      }),
   })
   return (
      <form
         onSubmit={form.onSubmit(values => {
            mutate(values)
            onSave()
         })}>
         <Stack>
            <Stack gap={4}>
               <Input.Label>Title</Input.Label>
               <Input
                  placeholder="Enter the title"
                  {...form.getInputProps('title')}
               />
            </Stack>
            <Stack gap={4}>
               <Input.Label>URL</Input.Label>
               <Input
                  placeholder="Enter the url"
                  {...form.getInputProps('url')}
               />
            </Stack>
            <Stack gap={4}>
               <Input.Label>Rating</Input.Label>
               <Rating fractions={2} {...form.getInputProps('rating')} />
            </Stack>
            <Stack gap={4}>
               <Input.Label>Amount</Input.Label>
               <NumberInput
                  min={0}
                  hideControls
                  prefix="₹"
                  decimalScale={2}
                  allowNegative={false}
                  thousandSeparator=","
                  placeholder="Enter the current amount"
                  {...form.getInputProps('amount')}
               />
            </Stack>
            <Stack gap={4}>
               <Input.Label>Status</Input.Label>
               <SegmentedControl
                  size="xs"
                  fullWidth
                  withItemsBorders={false}
                  data={[
                     { label: 'Pending', value: 'PENDING' },
                     { label: 'Purchased', value: 'PURCHASED' },
                  ]}
                  {...form.getInputProps('status')}
               />
            </Stack>
            {form.values.status === 'PURCHASED' && (
               <>
                  <Stack gap={4}>
                     <Input.Label>Purchase Amount</Input.Label>
                     <NumberInput
                        min={0}
                        hideControls
                        prefix="₹"
                        decimalScale={2}
                        allowNegative={false}
                        thousandSeparator=","
                        placeholder="Enter the purchase amount"
                        {...form.getInputProps('purchase_amount')}
                     />
                  </Stack>
                  <Stack gap={4}>
                     <Input.Label>Purchase Date</Input.Label>
                     <DateInput
                        valueFormat="MMM DD, YYYY"
                        placeholder="Enter the purchase date"
                        {...form.getInputProps('purchase_date')}
                     />
                  </Stack>
               </>
            )}
         </Stack>
         <Group justify="flex-end" mt="md">
            <Button type="submit">Save</Button>
         </Group>
      </form>
   )
}
