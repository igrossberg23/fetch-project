import { dogApi } from '@/lib/axios';
import { SnackContext } from '@/store/snack-context';
import { Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';

export default function Header() {
	const router = useRouter();
	const { alert } = useContext(SnackContext);

	const logout = async () => {
		console.log('logout');
		try {
			const res = await dogApi.post('/auth/logout');
			router.push('/login');
			alert('success', 'Logged out successfully');
		} catch (error) {
			console.error(error);
			alert('error', 'Failed to log out');
		}
	};

	return (
		<div className='flex gap-4 py-4 px-4 items-center justify-between bg-neutral-700 text-white'>
			<Image
				alt='logo'
				src='logo.svg'
				width='100'
				height='50'
			/>
			<h1 className='text-4xl'>Furry Friend Finder</h1>
			<IconButton
				color='primary'
				onClick={logout}
			>
				<Logout
					fontSize='large'
					className='text-white'
				/>
			</IconButton>
		</div>
	);
}
