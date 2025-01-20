import {
  CHAT_GROUP_USERS,
  GROUP_CHAT_FETCH,
  GROUP_CHAT_URL,
} from "@/lib/apiEndPoints";

export async function fetchChatGroup(
  token: string | undefined | null
): Promise<GroupChatType[]> {
  try {
    if (!token) {
      return [];
    }
    const res = await fetch(`${GROUP_CHAT_FETCH}?timestamp=${Date.now()}`, {
      headers: {
        Authorization: token,
      },
    });

    const response = await res.json();
    console.log("got full data", response);

    if (response?.message) {
      return response?.data;
    }
  } catch (error) {
    console.log("something wrong");
  }
  return [];
}

export async function fetchChatSingleGroup(id: string) {
  try {
    if (!id) {
      throw new Error("ID is required to fetch group data");
    }

    const url = `${GROUP_CHAT_URL}/${id}`;
    console.log("Fetching URL:", url);

    const res = await fetch(url, {
      cache: "no-cache",
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response = await res.json();
    console.log("Got full single group data:", response);

    if (response?.message) {
      return response?.data;
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
  return null;
}

export async function groupChatUsers(id:string) {
  try {
    if (!id) {
      throw new Error("ID is required to fetch group data");
    }

    const res = await fetch(`${CHAT_GROUP_USERS}?group_id=${id}`, {
      cache: "no-cache",
    });

    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const response = await res.json();
    console.log("Got users chat dataa:", response);

    if (response?.message) {
      return response?.data;
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
  return null;
}
