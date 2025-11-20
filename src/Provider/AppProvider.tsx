import { createContext, ReactNode, useState } from "react";

interface User {
    username: string;
    password: string;
}

interface Context {
    user?: User
    setUser?: React.Dispatch<React.SetStateAction<User | undefined>>
}

const defaulValue: Context = {
    user: undefined,
    setUser: undefined
}

interface Props {
    children: ReactNode
}

export const AppContext = createContext(defaulValue);

const AppProvider = ({ children }: Props) => {

    const [user, setUser] = useState<User>();

    return (
        <AppContext.Provider value={{ user: user, setUser: setUser}}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider;
