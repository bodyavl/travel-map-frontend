import s from './SigUp.module.scss'
import {useState, FormEvent} from 'react'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
    }


    return (
        <>
            <form onSubmit={handleSubmit} className={s.formContainer}>
                <label htmlFor="email" className={s.formLabel}>Email</label>
                <input type="text" id='email' className={s.formTextInput} name='email' onChange={e => setEmail(e.target.value)} required/>
                <label htmlFor="username" className={s.formLabel}>Username</label>
                <input type="text" id='username' className={s.formTextInput} name='username' onChange={e => setUsername(e.target.value)} required/>
                <label htmlFor="password" className={s.formLabel}>Password</label>
                <input type="password" id='password' className={s.formTextInput} name='password' onChange={e => setPassword(e.target.value)} required/>
                <button className={s.formButton}>Login</button>
            </form>
        </>
    )
}

export default SignUp