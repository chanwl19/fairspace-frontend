import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Loader from './common/loader';
import Login from './pages/Authentication/Login';
import ECommerce from './pages/Dashboard/ECommerce';
import useRefreshToken from './hooks/useRefreshToken';
//import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const EditUser = lazy(() => import('./pages/UserPage/EditUser'));
const EditReservation = lazy(() => import('./pages/UserPage/EditReservation'));
const ResetPassword = lazy(() => import('./pages/UserPage/ResetPassword'));

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const routes = authCtx.routes;
  const refreshToken = useRefreshToken();

  useEffect(() => {
    if (!user) {
      async function refreshFunc() {
        await refreshToken();
      }
      refreshFunc();
    }
  }, []);

  const editUserPath = user?.roles?.filter(role => role?.pages?.some(page => '/editUser' === page.path));
  const editReservationPath = [1];
  return (
    <>
      {(user?.roles && user?.roles?.length > 0) &&
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerClassName="overflow-auto"
        />
      }
      <Suspense fallback={<Loader />}>
        <Router>
          <Routes>
            {(!user?.roles || user?.roles?.length === 0) && <Route index element={<Login />} />}
            <Route path='/resetPassword' element={<ResetPassword />} />
            {(user?.roles && user?.roles?.length > 0) &&
              (<Route element={<DefaultLayout />}>
                {(editUserPath && editUserPath.length > 0) &&
                  <Route path='/editUser' element={<EditUser />} />
                }
                {(editReservationPath && editReservationPath.length > 0) &&
                  <Route path='/editReservation' element={<EditReservation />} />
                }
                <Route index element={<ECommerce />} />
                {routes.map((routes, index) => {
                  const { path, component: Component } = routes;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Component />
                      }
                    />
                  );
                })}
              </Route>)
            }
          </Routes>
        </Router>
      </Suspense>
      {/* (!user?.roles || user?.roles?.length === 0) ? (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
      ) : (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerClassName="overflow-auto"
        />
        <Suspense fallback={<Loader />}>
          <Router>
            <Routes>
              <Route element={<DefaultLayout />}>
                {(editUserPath && editUserPath.length > 0) &&
                  <Route path='/editUser' element={<EditUser />} />
                }
                {(editReservationPath && editReservationPath.length > 0) &&
                  <Route path='/editReservation' element={<EditReservation />} />
                }
                <Route index element={<ECommerce />} />
                {routes.map((routes, index) => {
                  const { path, component: Component } = routes;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Component />
                      }
                    />
                  );
                })}
              </Route>
            </Routes>
          </Router>
        </Suspense>
      </>
      ) */}
    </>
  )

  ///const [loading, setLoading] = useState<boolean>(false);
  // const updateUserHandler = (user: User) => {
  //   setUser(user);
  // }

  //const {user} = useContext(AuthContext) as AuthContextType;
  //console.log(user)

  // return (
  //   <AuthProvider>
  //     <Root/>
  //   </AuthProvider>
  // )
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  // return loading ? (
  //   <Loader />
  // ) : (
  //   <>
  //     <Toaster
  //         position="top-right"
  //         reverseOrder={false}
  //         containerClassName="overflow-auto"
  //     />
  //     <Login />

  //   </>
  // return(
  // <>
  //   <Toaster
  //     position="top-right"
  //     reverseOrder={false}
  //     containerClassName="overflow-auto"
  //   />
  //   <Suspense fallback={<Loader />}>
  //     <Routes>
  //       <Route element={<DefaultLayout />}>
  //       <Route index element={<ECommerce />} />
  //         {routes.map((routes, index) => {
  //           const { path, component: Component } = routes;
  //           return (
  //             <Route
  //               key={index}
  //               path={path}
  //               element={
  //                 <Component />
  //               }
  //             />
  //           );
  //         })}
  //       </Route>
  //     </Routes>
  //   </Suspense>
  // </>)
  //);
}

export default App;
