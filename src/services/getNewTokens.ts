export default async function getNewTokens(): Promise<boolean> {
  let resCheckToken = await fetch(`${import.meta.env.VITE_API_URL}/user/token`, {
    method: "post",
    body: JSON.stringify({ token: localStorage.refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (resCheckToken.status === 200) {
    let result = await resCheckToken.json();
    localStorage.accessToken = result.accessToken;
    localStorage.refreshToken = result.refreshToken;
    return true;
  } else {
    return false;
  }
}
