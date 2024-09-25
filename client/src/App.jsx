import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Index'
import Chat from './pages/chat/Index'
import Profile from './pages/profile/Index'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

//Here what we are doing is if userInfo is not undefined then isAuthenticated = true
//So if it is Authenticated the we will return children otherwise we will return the auth page

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

//Its just the opposite condition of what we wrote previously

function App() {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () =>{
      try{
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials:true,
        })
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined)
        }
        console.log(response);
      }catch(error){
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    }

    if(!userInfo){
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo])

  if(loading){
    return <div>Loading</div>
  }
  return (
    <BrowserRouter> 
       <Routes >
          <Route path='/auth' element = {
            <AuthRoute>
              <Auth></Auth>
            </AuthRoute>
          } />
          <Route path='/chat' element = {
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          <Route path='/profile' element = {
            <PrivateRoute>
            <Profile />
          </PrivateRoute>
          } />
          <Route path='*' element = {<Navigate to="/auth" />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
