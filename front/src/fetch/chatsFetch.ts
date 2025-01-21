import { CHAT_MSG } from "@/lib/apiEndPoints";

export async function fetchChatMsg(id: string) {
  try {
    if (!id) {
      throw new Error("ID is required to fetch group data");
    }

    const url = `${CHAT_MSG}/${id}`;
    console.log("Fetching URL:", url);

    const res = await fetch(url, {
      cache: "no-cache",
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response = await res.json();
    console.log("Got full chats messages:", response);

    if (response?.message) {
      return response?.data;
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
  return null;
}