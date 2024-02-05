'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
   Button,
   Center,
   Input,
   Loader,
   PasswordInput,
   Stack,
} from '@mantine/core'

export default function Login() {
   const router = useRouter()
   const [code, setCode] = useState('')
   const [error, setError] = useState('')
   const [status, setStatus] = useState('LOADING')

   useEffect(() => {
      const value = window.localStorage.getItem('secret')
      if (value === process.env.SECRET) {
         router.push('/')
      } else {
         setStatus('IDLE')
      }
   }, [router])

   const login = () => {
      if (!code) {
         setError('Please enter the code!')
         return
      }

      if (code !== process.env.SECRET) {
         setError('Please enter the correct code!')
         return
      }

      window.localStorage.setItem('secret', code)
      router.push('/')
   }

   if (status === 'LOADING')
      return (
         <Center h={80} pt={20}>
            <Loader />
         </Center>
      )

   return (
      <Center pt={20}>
         <Stack gap={4} w={320}>
            <Input.Label>Code</Input.Label>
            <PasswordInput
               value={code}
               error={error}
               placeholder="Enter the code"
               onChange={e => {
                  setCode(e.target.value)
                  setError('')
               }}
            />
            <Button fullWidth mt={8} disabled={!code} onClick={login}>
               Login
            </Button>
         </Stack>
      </Center>
   )
}
