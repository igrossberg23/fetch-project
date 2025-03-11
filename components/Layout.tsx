import { Container } from '@mui/material';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
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
				className={`flex min-h-screen flex-col gap-4${className}`}>
				<Header />
				<Container
					component='main'
					className='flex flex-grow flex-col items-center justify-between py-4 px-8 w-full'>
					{children}
				</Container>
				<Footer />
			</div>
		</div>
	);
}
