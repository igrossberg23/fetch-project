import { dogApi } from '@/lib/axios';
import { Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Image from 'next/image';

export default function Header() {
	const logout = async () => {
		console.log('logout');
		try {
			const res = await dogApi.post('/auth/logout');

			console.log('logout succeeded');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='flex gap-4 py-4 px-4 items-center justify-between bg-slate-700 text-white'>
			<Image
				alt='logo'
				src='logo.svg'
				width='100'
				height='50'
			/>
			<h1 className='text-4xl'>Furry Friend Finder</h1>
			<IconButton
				color='primary'
				onClick={() => {
					console.log('logout');
				}}
			>
				<Logout
					fontSize='large'
					className='text-white'
				/>
			</IconButton>
		</div>
	);
}
