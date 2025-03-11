import Image from 'next/image';
import AuthStatus from './header/AuthStatus';

export default function Header() {
	return (
		<>
			<div className='flex gap-4 py-4 px-4 items-center justify-between bg-neutral-700 text-white'>
				<Image
					alt='logo'
					src='logo.svg'
					width='100'
					height='50'
				/>
				<p className='text-2xl md:text-4xl text-center font-bold'>
					Furry Friend Finder
				</p>
				<AuthStatus />
			</div>
		</>
	);
}
