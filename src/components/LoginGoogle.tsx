'use client'
import { login } from '@/actions/auth'
import React from 'react'

export default function LoginGoogle() {
  return (
    <button onClick={()=>login("google")}>
      continue with google
    </button>
  )
}