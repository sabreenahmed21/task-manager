// app/auth/login/page.tsx
import LoginGithub from '@/components/LoginGithub'
import LoginGoogle from '@/components/LoginGoogle'
import React from 'react'

export default function page() {
  return (
    <>
    <h4>login</h4>
    <LoginGithub />
    <br />
    <LoginGoogle />
    </>
  )
}