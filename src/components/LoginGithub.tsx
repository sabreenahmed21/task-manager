'use client'
import { login } from '@/actions/auth'
import React from 'react'

export default function LoginGithub() {
  return (
    <button onClick={()=>login("github")}>
      continue with github
    </button>
  )
}