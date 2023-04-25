export default async function addMarker(apiUrl: string, data: object) {
    let res = await fetch(`${apiUrl}/mark/add`, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });
    return res;
  }