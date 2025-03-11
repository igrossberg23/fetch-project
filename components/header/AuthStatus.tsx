import { AuthContext } from '@/store/auth-context';
import { Login, Logout } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import LoginModal from '../LoginModal';
import LogoutModal from '../LogoutModal';

export default function AuthStatus() {
	const { isAuthenticated } = useContext(AuthContext);

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	return (
		<>
			<div className='flex gap-2'>
				{isAuthenticated ? (
					<Tooltip
						title='logout'
						placement='bottom'>
						<IconButton
							color='primary'
							onClick={() => setShowLogoutModal(true)}>
							<Logout
								fontSize='large'
								className='text-white'
							/>
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip
						title='login'
						placement='bottom'>
						<IconButton
							color='primary'
							onClick={() => setShowLoginModal(true)}>
							<Login
								fontSize='large'
								className='text-white'
							/>
						</IconButton>
					</Tooltip>
				)}
			</div>
			<LoginModal
				open={showLoginModal}
				onClose={() => setShowLoginModal(false)}
			/>
			<LogoutModal
				open={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
			/>
		</>
	);
}
