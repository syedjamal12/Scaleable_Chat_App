import { GROUP_CHAT_FETCH } from "@/lib/apiEndPoints";

export async function fetchChatGroup(token:string | undefined | null):Promise<GroupChatType[]>{
   try{
      if(!token){
         return []
      }
      const res = await fetch(`${GROUP_CHAT_FETCH}?timestamp=${Date.now()}`, {
         headers: {
           Authorization: token,
         },
       });
       

      const response = await res.json();
      console.log("got full data",response)

      if(response?.message){
         return  response?.data;
      }
   }catch(error){
      console.log("something wrong")
   }
    return [];
}