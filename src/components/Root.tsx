import { AuthContext } from '../context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useContext } from 'react';
import routes from '../routes';
import ECommerce from '../pages/Dashboard/ECommerce';
import Login from '../pages/Authentication/Login';
import Loader from '../common/loader';

const DefaultLayout = lazy(() => import('../layout/DefaultLayout'));



export default function Root() {
    const authCtx = useContext(AuthContext);
    const user  = authCtx.user;
    return (
        (!user?.roles || user?.roles?.length === 0) ? (
            <Login />
        ) : (
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
        )
    )

}