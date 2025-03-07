import Layout from '@/components/Layout';
import AuthContextProvider from '@/store/auth-context';
import SnackContextProvider from '@/store/snack-context';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthContextProvider>
			<SnackContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SnackContextProvider>
		</AuthContextProvider>
	);
}
