"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("");

    const fetchProfile = async () => {
        try {
            const response = await axios.post('/api/users/profile');
            console.log('Profile data', response.data.user._id);
            setData(response.data.user._id);
        } catch (error: any) {
            console.log('Failed to fetch profile', error.message);
            toast.error(error.message);
        }
    }

    const logout = async () => {
        try {
            await axios.post('/api/users/logout');
            console.log('Logout success');
            router.push('/login');
        } catch (error: any) {
            console.log('Logout failed', error.message);
            toast.error(error.message);
        }
    }

    return (
        <div className='flex flex-col items-center
        justify-center min-h-screen py-2'>
            <h1>Profile Page</h1>
            <hr />
            <button onClick={fetchProfile}
            className='bg-red-500 text-white py-2 px-4 rounded'>
                Get User Details
            </button>
            <hr /> 
            <h2>
                {data === "" ? "No data" : <Link href={`/profile/${data}`}>{data}</Link>}
            </h2>
            <hr />
            <hr />
            <button onClick={logout}
            className='bg-red-500 text-white py-2 px-4 rounded'>
                Logout
            </button>
        </div>
    )
}

