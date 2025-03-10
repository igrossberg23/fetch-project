import { dogApi } from '@/lib/axios';
import { validEmail, validName } from '@/lib/helpers';
import { AuthContext } from '@/store/auth-context';
import { SnackContext } from '@/store/snack-context';
import { Looks } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { useContext, useState } from 'react';

export interface LoginModalProps {
	open: boolean;
	onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [loading, setLoading] = useState(false);
	const { alert } = useContext(SnackContext);
	const { login } = useContext(AuthContext);

	const handleLogin = async () => {
		setNameError('');
		setEmailError('');

		if (!validName(name)) {
			setNameError('Please enter a valid name (only letters, no numbers)');
			return;
		}

		if (!validEmail(email)) {
			setEmailError('Please enter a valid email');
			return;
		}

		try {
			setLoading(true);

			await dogApi.post('/auth/login', { name, email });

			alert('success', 'Successfully authenticated');
			login(name, email);
			onClose();
		} catch (err) {
			console.error(err);
			alert('error', 'Something went wrong while authenticating');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			maxWidth='md'
			open={open}
			onClose={onClose}
			aria-labelledby='login-dialog-title'>
			<DialogTitle id='login-dialog-title'>Please Login Below</DialogTitle>
			<DialogContent className='flex flex-col gap-4 p-8'>
				<div />
				<TextField
					color='primary'
					required
					id='name'
					label='Name'
					aria-label='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					error={nameError !== ''}
					helperText={nameError}
				/>
				<TextField
					color='primary'
					required
					id='email'
					label='Email'
					aria-label='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={emailError !== ''}
					helperText={emailError}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleLogin}
					variant='contained'
					className='self-start'
					endIcon={
						loading ? <Looks className='animate-spin text-lg' /> : undefined
					}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}
