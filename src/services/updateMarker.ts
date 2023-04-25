export default async function updateMarker(
  apiUrl: string,
  data: object,
  id: string
) {
  let res = await fetch(`${apiUrl}/mark/update/${id}`, {
    method: "put",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.accessToken}`,
    },
  });
  return res;
}
