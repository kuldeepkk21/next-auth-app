"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function verifyEmailPage() {

    // const router = useRouter();

    const [token, setToken] = useState('')
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            setVerified(true)
            toast.success('Email verified successfully')
        } catch (error: any) {
            setError(true)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || '')

        // const {query} = router;
        // const urlToken = query.token;
        // setToken(typeof urlToken === 'string' ? urlToken : '')

    }, [])

    useEffect( () => {
        if(token.length > 0) verifyEmail()
    }, [token])

  return (
    <div className='flex flex-col items-center
    justify-center min-h-screen py-2'>
        <h1 className='text-4xl'>Verify Email</h1>
        <h2 className='p-2 text-black bg-orange-500'>
            {token ? `${token}` : "No token found"}
        </h2>
        {verified && (
            <div>
                <h2>verified</h2>
                <Link href="/login">Go to login</Link>
            </div>
        )}
        {error && (
            <div>
                <h2>Verification failed</h2>
            </div>
        )}
    </div>
  )
}

