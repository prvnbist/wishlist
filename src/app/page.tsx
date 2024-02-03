'use client'

import { AxiosError } from 'axios'
import { useQuery } from 'react-query'

import { notifications } from '@mantine/notifications'
import { Center, Container, Loader, Text } from '@mantine/core'

import { getList } from '@/queries'
import useGlobalStore from '@/lib/zustand'

import { AddSort, Results, Sorts } from './sections'

function Home() {
   const sort = useGlobalStore(state => state.sort)

   const query = useQuery(['list', { sort }], () => getList(sort), {
      retry: 0,
      onError: error => {
         notifications.show({
            title: 'Error',
            message: (error as AxiosError).message,
         })
      },
   })

   return (
      <Container size="xl" mt={16} pt={16}>
         <AddSort />
         <Sorts />
         {query.isLoading ? (
            <Center h="80px">
               <Loader />
            </Center>
         ) : (
            <Results data={query.data ?? []} />
         )}
      </Container>
   )
}

export default Home
