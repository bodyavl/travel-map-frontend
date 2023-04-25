export default async function getNewTokens(apiUrl: string) {
  let resCheckToken = await fetch(`${apiUrl}/user/token`, {
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
