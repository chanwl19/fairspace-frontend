import { createContext, useState, lazy } from 'react';
import { User } from '../models/User';
import { ReactNode } from 'react';

const FacilityManitenance = lazy(() => import('../components/facility/FacilityMaintenance'));
const UserMaintenance = lazy(() => import('../components/user/UserMaintenance'));
const Reservation = lazy(() => import('../components/reservation/Reservation'));
const Profile = lazy(() => import('../components/profile/Profile'));

type RouteType = {
    path: string;
    title: string;
    component: React.LazyExoticComponent<() => JSX.Element>
}

type BasicProps = {
    children: ReactNode;
}

const defaultRoutes = [
    {
        path: '/facility',
        title: 'Facility Maintenance',
        component: FacilityManitenance
    },
    {
        path: '/user',
        title: 'User Maintenance',
        component: UserMaintenance
    },
    {
        path: '/reservation',
        title: 'Reservation',
        component: Reservation
    },
    {
        path: '/profile',
        title: 'My Profile',
        component: Profile
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
