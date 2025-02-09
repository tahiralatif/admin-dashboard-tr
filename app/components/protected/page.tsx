import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function  ProtectedRoutpage({children} :
    {children: React.ReactNode}
) {

const router = useRouter();

useEffect(() => {
    const isloggedIn = localStorage.getItem('isloggedIn');
    if(!isloggedIn) {
        router.push('/login')
    }   
}, [router])

  return (
<>
{children}
</>  )
}

 ;