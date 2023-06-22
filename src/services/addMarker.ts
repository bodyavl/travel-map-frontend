export default async function addMarker(data: object): Promise<Response> {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/mark/add`, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    return res;
  }