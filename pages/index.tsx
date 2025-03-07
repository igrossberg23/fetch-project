import Image from 'next/image';
import { Geist, Geist_Mono } from 'next/font/google';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function Home() {
	const router = useRouter();

	const gotoLogin = () => router.push('/login');

	return (
		<div className='flex flex-col gap-4'>
			<h2 className='text-2xl'>Meet your furry best friend today!</h2>
			<Button
				onClick={gotoLogin}
				variant='contained'
				className='self-center'
			>
				Log In
			</Button>
		</div>
	);
}
