import s from './ForgotPassword.module.scss'
import React, { FormEvent, useState } from 'react'
interface Props {
    apiUrl: string
}

const ForgotPassword = ({apiUrl}:Props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);

    setIsLoading(false);
  }

  return (
    <>
    <form onSubmit={handleSubmit} className={s.formContainer}>
        <label htmlFor="email" className={s.formLabel}>Email</label>
        <input type="email" id='email' className={s.formTextInput} name='email' onChange={e => setEmail(e.target.value)} disabled={isLoading} required/>
        <button className={s.formButton} disabled={isLoading}>Change Password</button>
    </form>
</>
  )
}

export default ForgotPassword