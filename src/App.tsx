import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Loader from './common/loader';
import useRefreshToken from './hooks/useRefreshToken';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const EditUser = lazy(() => import('./components/user/components/EditUser'));
const EditReservation = lazy(() => import('./components/reservation/components/EditReservation'));
const ResetPassword = lazy(() => import('./components/user/components/ResetPassword'));
const Login = lazy(() => import('./components/authenication/Login'));
const EditFacility = lazy(() => import('./components/facility/components/EditFacility'));
const WelcomPage = lazy(() => import('./components/WelcomPage'));

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const routes = authCtx.routes;
  const refreshToken = useRefreshToken();
  const editUserPath = user?.roles?.filter(role => role?.pages?.some(page => '/editUser' === page.path));
  const editReservationPath = user?.roles?.filter(role => role?.pages?.some(page => '/editReservation' === page.path));
  const editFacilityPath = user?.roles?.filter(role => role?.pages?.some(page => '/editFacility' === page.path));

  // if (!user?.roles || user?.roles?.length === 0) {
  //   router = createBrowserRouter([
  //     {
  //       path: '',
  //       element: <Login />
  //     },
  //     {
  //       path: '/resetPassword',
  //       element: <ResetPassword />
  //     }
  //   ])
  // } else {
  //   router = createBrowserRouter([
  //     {
  //       path: '',
  //       element: <DefaultLayout />,
  //       children: [
  //         { index: true, element: <ECommerce /> },
  //         { path: '/editUser', element: <EditUser /> },
  //         { path: '/editReservation', element: <EditReservation /> },
  //         { path: '/facility', element: <FacilityManitenance /> },
  //         { path: '/reports', element: <Reports /> },
  //         { path: '/user', element: <UserMaintenance /> },
  //         { path: '/reservation', element: <Reservation /> },
  //         { path: '/support', element: <Support /> },
  //         { path: '/profile', element: <Profile /> }
  //       ]
  //     },
  //   ])
  // };

  useEffect(() => {
    if (!user) {
      async function refreshFunc() {
        await refreshToken();
      }
      refreshFunc();
    }
  }, []);

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
                {
                  (editFacilityPath && editFacilityPath.length > 0) &&
                  <Route path='/editFacility' element={<EditFacility />} />
                }
                <Route index element={<WelcomPage />} />
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
