import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { Routes, Route, useParams } from 'react-router-dom';
import Loader from './common/loader';
import Login from './pages/Authentication/Login';
import ECommerce from './pages/Dashboard/ECommerce';
import useRefreshToken from './hooks/useRefreshToken';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const EditUser = lazy(() => import('./pages/UserPage/EditUser'));
const EditReservation = lazy(() => import('./pages/UserPage/EditReservation'));
const ResetPassword = lazy(() => import('./pages/UserPage/ResetPassword'));

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const routes = authCtx.routes;
  const refreshToken = useRefreshToken();
  const { token } = useParams();


  console.log("token ", token);

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
  console.log('editUserPath ', editUserPath)
  return (
    (!user?.roles || user?.roles?.length === 0) ? (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
        </Routes>
      </Suspense>
    ) : (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerClassName="overflow-auto"
        />
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      </>
    )
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
