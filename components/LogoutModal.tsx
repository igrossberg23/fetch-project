import { dogApi } from '@/lib/axios';
import { AuthContext } from '@/store/auth-context';
import { SnackContext } from '@/store/snack-context';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { useContext } from 'react';

export interface LogoutModalProps {
	open: boolean;
	onClose: () => void;
}

export default function LogoutModal({ open, onClose }: LogoutModalProps) {
	const { alert } = useContext(SnackContext);
	const { logout } = useContext(AuthContext);

	const handleLogout = async () => {
		try {
			await dogApi.post('/auth/logout');
			alert('success', 'Logged out successfully');
			logout();
			onClose();
		} catch (error) {
			console.error(error);
			alert('error', 'Failed to log out');
		}
	};
	return (
		<Dialog
			open={open}
			onClose={onClose}>
			<DialogTitle>Log out?</DialogTitle>
			<DialogContent>
				<h2>Are you sure you want to log out?</h2>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleLogout}>Log Out</Button>
			</DialogActions>
		</Dialog>
	);
}
