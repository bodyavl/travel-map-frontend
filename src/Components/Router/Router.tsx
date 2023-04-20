import { BrowserRouter, Route, Routes } from "react-router-dom"
import Map from "../../Pages/Map/Map"
import Login from "../../Pages/Login/Login"
import SignUp from "../../Pages/SignUp/SignUp"

const Router = () => {
  const apiUrl = 'https://travel-map-api.onrender.com'
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Map apiUrl={apiUrl}/>}/>
            <Route path="login" element={<Login apiUrl={apiUrl}/>}/>
            <Route path="signup" element={<SignUp apiUrl={apiUrl}/>}/>

        </Routes>
    </BrowserRouter>
  )
}

export default Router