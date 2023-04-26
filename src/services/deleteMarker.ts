export default async function deleteMarker(apiUrl: string, id: string) {
    let res = await fetch(`${apiUrl}/mark/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    return res;
  }