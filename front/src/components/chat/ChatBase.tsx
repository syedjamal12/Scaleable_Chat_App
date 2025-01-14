"use client"

import { getSocket } from '@/lib/socket.config'
import React, { useEffect, useMemo } from 'react'
import { v4 as uuid4} from "uuid"
import { Button } from '../ui/button'

const ChatBase = () => {

    let socket = useMemo(()=>{
        const socket = getSocket()
       return socket.connect();
    },[])

    useEffect(()=>{
        socket.on("message",(data:any)=>{
            console.log("socket message is",data)
        })
        return ()=> { socket.close() };
    },[])

    function handleClick (){
        socket.emit("message",{name:"Hasnat",id:uuid4()})
    }
  return (
    <Button onClick={handleClick}>send Msg</Button>
  )
}

export default ChatBase
