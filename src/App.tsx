import AppProvider from './Provider/AppProvider'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home, Profile, Login, JobList, AdminJobList, ManageCandidate } from './pages'
import { PublicLayout, AnotherLayout } from './layouts'

function App() {

  const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        {
          path: '/',
          element: <Login />
        },
      ]
    },
    {
      element: <AnotherLayout />,
      children: [
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/jobs',
          element: <JobList />
        },
        {
          path: '/admin/jobs',
          element: <AdminJobList />
        },
        {
          path: '/admin/jobs/:jobId',
          element: <ManageCandidate />
        }
      ]
    }
  ])

  return (
    // cara lama tapi masih di pakai
    // <BrowserRouter>
    //   <AppProvider>
    //     <Routes>
    //       <Route element={<PublicLayout />}>
    //         <Route path={'/'} element={<Home />}/>
    //         <Route path={'/product'} element={<Product />} />
    //         <Route path={'/profile'} element={<Profile />} />
    //       </Route>
    //     </Routes>
    //   </AppProvider>
    // </BrowserRouter>
    <AppProvider>
      <RouterProvider router={router}/>
    </AppProvider>
  )
}

export default App
