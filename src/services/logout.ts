export default async function logout(apiUrl: string) {
  let res = await fetch(`${apiUrl}/user/logout`, {
    method: "delete",
    body: JSON.stringify({ refreshToken: localStorage.refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}
