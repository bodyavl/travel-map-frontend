export default async function updateMarker(
  data: object,
  id: string
): Promise<Response> {
  let res = await fetch(`${import.meta.env.VITE_API_URL}/mark/update/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.accessToken}`,
    },
  });
  return res;
}
