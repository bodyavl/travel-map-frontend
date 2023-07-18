import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "../../Pages/Map/Map"
import Login from "../../Pages/Login/Login"
import SignUp from "../../Pages/SignUp/SignUp"
import ForgotPassword from "../../Pages/ForgotPassword/ForgotPassword"

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Map />}/>
            <Route path="login" element={<Login />}/>
            <Route path="signup" element={<SignUp />}/>
            <Route path="forgotPassword" element={<ForgotPassword />}></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default Router