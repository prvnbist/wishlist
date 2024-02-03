'use client'

import { AxiosError } from 'axios'
import { useQuery } from 'react-query'

import { notifications } from '@mantine/notifications'
import { Center, Container, Group, Loader } from '@mantine/core'

import { getList } from '@/queries'
import useGlobalStore from '@/lib/zustand'

import { AddSort, Results, Search, Sorts } from './sections'

function Home() {
   const [sort, search] = useGlobalStore(state => [state.sort, state.search])

   const query = useQuery(
      ['list', { sort, search }],
      () => getList(sort, search),
      {
         retry: 0,
         onError: error => {
            notifications.show({
               title: 'Error',
               message: (error as AxiosError).message,
            })
         },
      }
   )

   return (
      <Container size="xl" mt={16} pt={16}>
         <Group>
            <AddSort />
            <Search />
         </Group>
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
