import dayjs from 'dayjs'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
   IconPhoto,
   IconPlus,
   IconTrash,
   IconUpload,
   IconX,
} from '@tabler/icons-react'

import {
   ActionIcon,
   Box,
   Button,
   Drawer,
   Flex,
   Group,
   Image,
   Input,
   Loader,
   NumberInput,
   Rating,
   SegmentedControl,
   Stack,
   Text,
   TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { Wish } from '@/types'
import { isURL } from '@/utils'
import { addWish } from '@/actions'

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

const DROPZONE_ICON_DIMENSTION = { width: 44, height: 44 }
const DROPZONE_STATES = {
   accept: (
      <Dropzone.Accept>
         <IconUpload
            stroke={1.5}
            style={{
               ...DROPZONE_ICON_DIMENSTION,
               color: 'var(--mantine-color-blue-6)',
            }}
         />
      </Dropzone.Accept>
   ),
   reject: (
      <Dropzone.Reject>
         <IconX
            stroke={1.5}
            style={{
               ...DROPZONE_ICON_DIMENSTION,
               color: 'var(--mantine-color-red-6)',
            }}
         />
      </Dropzone.Reject>
   ),
   idle: (
      <Dropzone.Idle>
         <IconPhoto
            stroke={1.5}
            style={{
               ...DROPZONE_ICON_DIMENSTION,
               color: 'var(--mantine-color-dimmed)',
            }}
         />
      </Dropzone.Idle>
   ),
}

const Form = ({
   onSave,
   operation = 'INSERT',
}: {
   onSave: () => void
   operation?: 'INSERT' | 'UPDATE'
}) => {
   const queryClient = useQueryClient()

   const [isSaving, setIsSaving] = useState(false)
   const [files, setFiles] = useState<FileWithPath[]>([])

   const previews = files.map((file, index) => {
      const imageUrl = URL.createObjectURL(file)
      return (
         <Image
            key={index}
            src={imageUrl}
            alt={file.name}
            style={{ borderRadius: 4 }}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
         />
      )
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
      validateInputOnBlur: true,
      validate: {
         title: value => (!value ? 'Please add a title' : null),
         url: value => (!isURL(value) ? 'Please add a valid url' : null),
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

   const save = async (values: any) => {
      setIsSaving(true)
      try {
         const form = new FormData()
         for (let key in values) {
            if (values[key]) {
               form.append(key, values[key])
            }
         }

         form.append('file', files?.[0])

         await addWish(form)

         queryClient.invalidateQueries('wishes')
         onSave()
      } catch (error) {
         notifications.show({
            title: 'Error',
            message: (error as Error).message,
         })
      } finally {
         setIsSaving(false)
      }
   }
   return (
      <form onSubmit={form.onSubmit(values => save(values))}>
         <Stack>
            <Stack gap={4}>
               <Input.Label>Title</Input.Label>
               <TextInput
                  placeholder="Enter the title"
                  {...form.getInputProps('title')}
               />
            </Stack>
            <Stack gap={4}>
               <Input.Label>URL</Input.Label>
               <TextInput
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
               <Input.Label>Image</Input.Label>
               <Dropzone
                  multiple={false}
                  onDrop={setFiles}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}>
                  <Flex
                     gap={16}
                     mih={60}
                     align="center"
                     style={{ pointerEvents: 'none' }}>
                     {DROPZONE_STATES['accept']}
                     {DROPZONE_STATES['reject']}
                     {DROPZONE_STATES['idle']}
                     <Flex direction="column" gap={8}>
                        <Text size="md" inline>
                           Drag image here or click to select file
                        </Text>
                        <Text size="sm" c="dimmed" inline>
                           File size should not exceed 5mb.
                        </Text>
                     </Flex>
                  </Flex>
               </Dropzone>
            </Stack>
            {files.length > 0 && (
               <Group>
                  <Box w={100}>{previews}</Box>
                  <ActionIcon
                     color="gray"
                     variant="subtle"
                     onClick={() => setFiles([])}>
                     <IconTrash size={16} />
                  </ActionIcon>
               </Group>
            )}
            {operation === 'UPDATE' && (
               <>
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
               </>
            )}
         </Stack>
         <Group justify="flex-end" mt="md">
            <Button
               type="submit"
               disabled={isSaving}
               leftSection={
                  isSaving ? <Loader size="xs" color="white" /> : null
               }>
               Save
            </Button>
         </Group>
      </form>
   )
}
