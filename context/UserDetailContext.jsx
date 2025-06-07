export const UserDetailContext = React.createContext();

export const UserDetailProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <UserDetailContext.Provider value={{ user, setUser }}>
            {children}
        </UserDetailContext.Provider>
    );
};
