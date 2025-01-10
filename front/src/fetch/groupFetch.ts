import { GROUP_CHAT_FETCH } from "@/lib/apiEndPoints";

export async function fetchChatGroup(token:string | undefined | null):Promise<string[]>{
   try{
      if(!token){
         return []
      }
      const res = await fetch(GROUP_CHAT_FETCH, {
         headers:{
            Authorization:token
         },
         next:{
            revalidate:60*60,
            tags:["dashboard"]
         }
      })

      const response = await res.json();

      if(response?.message){
         return  response?.data;
      }
   }catch(error){
      console.log("something wrong")
   }
    return [];
}