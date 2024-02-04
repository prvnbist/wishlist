'use client'

import Link from 'next/link'
import { Inter } from 'next/font/google'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import {
   ColorSchemeScript,
   Container,
   MantineProvider,
   Text,
} from '@mantine/core'

import '../styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'

import classes from './layout.module.css'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang="en">
         <head>
            <title>Wishlist</title>
            <ColorSchemeScript defaultColorScheme="dark" />
         </head>
         <body className={inter.className}>
            <QueryClientProvider client={queryClient}>
               <MantineProvider
                  defaultColorScheme="dark"
                  theme={{
                     fontFamily: inter.style.fontFamily,
                  }}>
                  <ModalsProvider>
                     <Notifications />
                     <header className={classes.header}>
                        <Container size="xl" className={classes.inner}>
                           <Link href="/" className={classes.logo}>
                              <Text size="md">Wishlist</Text>
                           </Link>
                        </Container>
                     </header>
                     {children}
                  </ModalsProvider>
               </MantineProvider>
               <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
         </body>
      </html>
   )
}
