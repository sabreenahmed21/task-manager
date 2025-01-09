// app/auth/login/page.tsx
import LoginGithub from '@/components/LoginGithub'
import LoginGoogle from '@/components/LoginGoogle'
import React from 'react'

export default function page() {
  return (
    <>
    <h3>login</h3>
    <LoginGithub />
    <br />
    <LoginGoogle />
    </>
  )
}