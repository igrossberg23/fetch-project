import { Container } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';

export default function Layout({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { pathname }: { pathname: string } = useRouter();

	return (
		<div>
			<Head>
				<title>Furry Friends</title>
				<meta
					name='description'
					content='Your furry friend finder!'
				/>
				<link
					rel='icon'
					href='/favicon.ico'
				/>
			</Head>
			<div
				id='wrapper'
				className={`flex min-h-screen flex-col gap-4${className}`}
			>
				<Header />
				<main className='flex flex-grow flex-col items-center justify-between py-4 px-8'>
					{children}
				</main>
				<Footer />
			</div>
		</div>
	);
}
