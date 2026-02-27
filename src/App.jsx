import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoaderX from './Components/Loader/LoaderX'

const Home = lazy(() => import('./Components/Pages/Home'))
const Details = lazy(() => import('./Components/Details/Details'))
const Category = lazy(() => import('./Components/Pages/Category'))
const Profile = lazy(() => import('./Components/Pages/Profile'))
const Search = lazy(() => import('./Components/Pages/Search'))
const AdminPanel = lazy(() => import('./Components/Pages/AdminPanel'))

const App = () => {
  return (
   <>
   <Suspense fallback={
     <LoaderX />
   }>
     <Routes>
      <Route  path='/' element={<Home/>}/>
      <Route  path='/details' element={<Details/>}/>
      <Route  path='/category/:name' element={<Category/>}/>
      <Route  path='/profile' element={<Profile/>}/>
      <Route  path='/search' element={<Search/>}/>
      <Route  path='/admin' element={<AdminPanel/>}/>
     </Routes>
   </Suspense>
   </>
  )
}

export default App
