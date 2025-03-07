import { createContext, useState } from 'react';

const initAuth = {
	isAuthenticated: false,
	name: '',
	email: '',
	login: (name: string, email: string) => {},
	logout: () => {},
};

export const AuthContext = createContext(initAuth);

export default function AuthContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const login = (name: string, email: string) => {
		setIsAuthenticated(true);
		setName(name);
		setEmail(email);
	};

	const logout = () => {
		setIsAuthenticated(false);
		setName('');
		setEmail('');
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, name, email, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
