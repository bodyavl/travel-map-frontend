export default async function login(email: string, password: string) {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`,
            { method: 'post',
            body: JSON.stringify({ email, password }),
            headers : { 
            'Content-Type': 'application/json'
            }
        });
    return res;
}