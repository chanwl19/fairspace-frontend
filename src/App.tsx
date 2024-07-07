import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Loader from './common/loader';
import Login from './pages/Authentication/Login';
import ECommerce from './pages/Dashboard/ECommerce';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const routes = authCtx.routes;
  return (
    (!user?.roles || user?.roles?.length === 0) ? (
      <Login />
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
