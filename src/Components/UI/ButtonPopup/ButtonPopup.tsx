import { ReactNode } from 'react'
import s from './ButtonPopup.module.scss'

interface IButtonPopupProps {
    handleClick: () => void | Promise<void> ,
    children: ReactNode
}
const ButtonPopup = ({handleClick, children}: IButtonPopupProps) => {
  return (
    <button className={s.button} onClick={handleClick}>{children}</button>
  )
}

export default ButtonPopup