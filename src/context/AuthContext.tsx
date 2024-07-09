import { createContext, useState, lazy } from 'react';
import { BasicProps } from '../models/props/BasicType';
import { User } from '../models/User';

const FacilityManitenance = lazy(() => import('../pages/UserPage/FacilityMaintenance'));
const Reports = lazy(() => import('../pages/UserPage/Reports'));
const UserMaintenance = lazy(() => import('../pages/UserPage/UserMaintenance'));
const Reservation = lazy(() => import('../pages/UserPage/Reservation'));
const Support = lazy(() => import('../pages/UserPage/Support'));
const Profile = lazy(() => import('../pages/UserPage/Profile'));

type RouteType = {
    path: string;
    title: string;
    component: React.LazyExoticComponent<() => JSX.Element>
}

const defaultRoutes = [
    {
        path: '/facility',
        title: 'Facility Maintenance',
        component: FacilityManitenance,
    },
    {
        path: '/reports',
        title: 'Reports',
        component: Reports,
    },
    {
        path: '/user',
        title: 'User Maintenance',
        component: UserMaintenance,
    },
    {
        path: '/reservation',
        title: 'Reservation',
        component: Reservation,
    },
    {
        path: '/support',
        title: 'Support',
        component: Support,
    },
    {
        path: '/profile',
        title: 'My Profile',
        component: Profile,
    }
]

type AuthContextObj = {
    user: User | null;
    loginUser: (user: User) => void;
    logoutUser: () => void;
    accessToken : string;
    storeAccessToken: (accessToken: string) => void;
    routes: RouteType[];
};

export const AuthContext = createContext<AuthContextObj>({
    user: new User(),
    loginUser: () => { },
    logoutUser: () => {},
    storeAccessToken: () => {},
    accessToken: '',
    routes: []
});

export function AuthContextProvider(props: BasicProps) {
    const [user, setUser] = useState<User | null>(null);
    const [routes, setRoutes] = useState<RouteType[]>([]);
    const [accessToken, setAccessToken] = useState<string>('');

    const loginUserHandler = (user: User) => {
        setUser(user);
        const pages = user.roles?.map(role => role.pages).flat();
        const filterRoutes = defaultRoutes.filter(route => pages!.some(page => route.path === page.path));
        setRoutes(filterRoutes);
    };
    
    const logoutUserHandler = () => {
        setUser(null);
    };

    const storeAccessTokenHandler = (accessToken: string) => {
        setAccessToken(accessToken);
    }


    const contextValue: AuthContextObj= {
        user: user,
        loginUser: loginUserHandler,
        logoutUser: logoutUserHandler,
        accessToken: accessToken,
        storeAccessToken: storeAccessTokenHandler,
        routes: routes
    }

    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
}

// export function useSomeContext() {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useSomeContext must be used within SomeProvider');
//     return ctx;
//  };
