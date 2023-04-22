import s from './SigUp.module.scss'
import {useState, FormEvent} from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
    apiUrl: string
}

const SignUp = ({apiUrl}: Props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        e.preventDefault();
        let res = await fetch(`${apiUrl}/user/signup`,
            { method: 'post',
            body: JSON.stringify({email, username, password}),
            headers : { 
            'Content-Type': 'application/json'
            }
        });
        if(res.status === 400) {
            alert("User with this username already exists!")
            setIsLoading(false);
            return;
        }
        let result = await res.json();
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('username', result.username);
        localStorage.setItem('refreshToken', result.refreshToken)
        setIsLoading(false);
        navigate('/')
    }


    return (
        <>
            <form onSubmit={handleSubmit} className={s.formContainer}>
                <label htmlFor="email" className={s.formLabel}>Email</label>
                <input type="email" id='email' className={s.formTextInput} name='email' onChange={e => setEmail(e.target.value)} disabled={isLoading} required/>
                <label htmlFor="username" className={s.formLabel}>Username</label>
                <input type="text" id='username' className={s.formTextInput} name='username' onChange={e => setUsername(e.target.value)} disabled={isLoading} required/>
                <label htmlFor="password" className={s.formLabel}>Password</label>
                <input type="password" id='password' className={s.formTextInput} name='password' onChange={e => setPassword(e.target.value)} disabled={isLoading} required/>
                <button className={s.formButton} disabled={isLoading}>Sign up</button>
            </form>
        </>
    )
}

export default SignUp