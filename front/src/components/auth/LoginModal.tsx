"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Image from 'next/image'
import { Button } from '../ui/button'
  

const LoginModal = () => {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button>Getting start</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">Welcome to QuickChat</DialogTitle>
        <DialogDescription>
          QuickChat makes it effortless to create secure chat links and start
          conversations in seconds.
        </DialogDescription>
      </DialogHeader>
      <Button variant="outline" >
        <Image
          src="/images/google.png"
          className=" mr-4"
          width={25}
          height={25}
          alt="google"
        />
        Continue with Google
      </Button>
    </DialogContent>
  </Dialog>

  )
}

export default LoginModal