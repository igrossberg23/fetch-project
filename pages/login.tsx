import { dogApi } from '@/lib/axios';
import { validEmail, validName } from '@/lib/helpers';
import { SnackContext } from '@/store/snack-context';
import { Looks } from '@mui/icons-material';
import { Button, Container, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

export default function Login() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [loading, setLoading] = useState(false);
	const { alert } = useContext(SnackContext);
	const router = useRouter();

	const login = async () => {
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

			const res = await dogApi.post('/auth/login', { name, email });

			alert('success', 'Successfully authenticated');

			router.push('/search');
		} catch (err) {
			console.error(err);
			alert('error', 'Something went wrong while authenticating');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container
			maxWidth='md'
			className='flex flex-col gap-4 rounded-xl mt-8'
		>
			<h1 className='text-xl mb-4'>Please Login Below:</h1>
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
			<Button
				onClick={login}
				variant='contained'
				className='self-start'
				endIcon={
					loading ? <Looks className='animate-spin text-lg' /> : undefined
				}
			>
				Submit
			</Button>
			<Button
				onClick={() => router.push('/search')}
				variant='outlined'
				className='self-start'
			>
				Go to Search
			</Button>
		</Container>
	);
}
