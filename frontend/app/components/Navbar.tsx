import React from 'react'
import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const Navbar = () => {
  return (
    <div className='w-full h-18 flex items-center px-10 justify-between bg-black border-b border-white/10'>
      <Link href="/" className='text-3xl font-["Google Sans Flex"] text-white cursor-pointer hover:text-white/80 transition'>
        OutreachX
      </Link>
      <div className='flex justify-between gap-5 items-center'>
        <SignedOut>
          <SignInButton mode="modal">
            <button className='bg-white text-black px-2 py-1.5 rounded-xl font-["Helvetica"] cursor-pointer hover:bg-gray-200 '>
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className='bg-[#6c47ff] text-white p-2 rounded-xl font-["Helvetica"] cursor-pointer hover:bg-purple-700'>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar


