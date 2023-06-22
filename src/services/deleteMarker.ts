export default async function deleteMarker(id: string): Promise<Response> {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/mark/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    return res;
  }