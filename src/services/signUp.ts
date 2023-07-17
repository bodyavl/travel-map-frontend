export default async function signUp(
  email: string,
  password: string,
  username: string
) {
  let res = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
    method: "post",
    body: JSON.stringify({ email, username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}
