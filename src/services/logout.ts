export default async function logout(): Promise<Response> {
  let res = await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
    method: "delete",
    body: JSON.stringify({ refreshToken: localStorage.refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
