import s from './Login.module.scss'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        e.preventDefault();
        let res = await login(email, password)
        if(res.status === 500) {
            alert("User with this email doesn't exist!")
            setIsLoading(false);
            return;
        }
        else if(res.status === 403) {
            alert("Wrong password!")
            setIsLoading(false);
            return;
        }
        let result = await res.json();
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('username', result.username);
        localStorage.setItem('refreshToken', result.refreshToken)
        setIsLoading(false);
        navigate('/');
    }


    return (
        <>
            <form onSubmit={handleSubmit} className={s.formContainer}>
                <label htmlFor="email" className={s.formLabel}>Email</label>
                <input type="email" id='email' className={s.formTextInput} name='email' onChange={e => setEmail(e.target.value)} disabled={isLoading} required/>
                <label htmlFor="password" className={s.formLabel}>Password</label>
                <input type="password" id='password' className={s.formTextInput} name='password' onChange={e => setPassword(e.target.value)} disabled={isLoading} required/>
                <button className={s.formButton} disabled={isLoading}>Login</button>
            </form>
            <Link to={'/forgotPassword'}></Link>
        </>
  )
}

export default Login;