import DogTile from '@/components/DogTile';
import { dogApi } from '@/lib/axios';
import { SnackContext } from '@/store/snack-context';
import { Dog } from '@/types/general';
import { Button, MenuItem, Select } from '@mui/material';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function Search() {
	const [allBreeds, setAllBreeds] = useState<string[]>([]);
	const [dogs, setDogs] = useState<Dog[]>([]);
	const [searchUrl, setSearchUrl] = useState('/dogs/search');
	const [nextUrl, setNextUrl] = useState('');
	const [prevUrl, setPrevUrl] = useState('');
	const [authenticated, setAuthenticated] = useState(false);

	const router = useRouter();
	const { alert } = useContext(SnackContext);

	const [selectedBreed, setSelectedBreed] = useState(' ');

	useEffect(() => {
		if (!authenticated) return;
		fetchBreeds();
		fetchDogs();
	}, [authenticated, searchUrl]);

	const quickAuth = async () => {
		try {
			const res = await dogApi.post('/auth/login', {
				name: 'Isaac',
				email: 'isaac@test.com',
			});

			if (res.status === 200) {
				setAuthenticated(true);
				alert('success', 'Authenticated successfully');
			}
		} catch (err) {
			alert('error', 'Something went wrong authenticating');
		}
	};

	const fetchBreeds = async () => {
		try {
			const res = await dogApi.get('/dogs/breeds');
			setAllBreeds(res.data);
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.status === 401) router.push('/login?status=expired');
			}
			console.error(err);
		}
	};

	const fetchDogs = async () => {
		try {
			const searchRes = await dogApi.get(searchUrl);

			const resultIds = searchRes.data.resultIds;
			setNextUrl(searchRes.data.next);
			setPrevUrl(searchRes.data.prev);

			const dogRes = await dogApi.post('/dogs', resultIds);

			setDogs(dogRes.data);
		} catch (err) {
			console.error(err);
		}
	};

	const pageNext = () => setSearchUrl(nextUrl);
	const pagePrev = () => setSearchUrl(prevUrl);

	return (
		<div className='flex flex-col gap-2 items-center'>
			<h2 className='text-xl'>Search Page</h2>
			<Button
				onClick={quickAuth}
				variant='contained'
				color='primary'
			>
				Quick Auth
			</Button>
			<div>
				<Select
					value={selectedBreed}
					onChange={(e) => setSelectedBreed(e.target.value)}
				>
					<MenuItem
						value=' '
						key=' '
					>
						Select A Breed
					</MenuItem>
					{allBreeds.map((breed) => (
						<MenuItem
							key={breed}
							value={breed}
						>
							{breed}
						</MenuItem>
					))}
				</Select>
			</div>
			<div className='self-stretch px-8'>
				{prevUrl && <Button onClick={pagePrev}>Prev</Button>}
				{nextUrl && (
					<Button
						onClick={pageNext}
						className='float-right'
					>
						Next
					</Button>
				)}
			</div>
			<div className='flex gap-2 flex-wrap justify-center'>
				{dogs.map((d) => (
					<DogTile dog={d} />
				))}
			</div>
			<div className='flex justify-between items-center self-stretch'>
				{prevUrl && <Button onClick={pagePrev}>Prev</Button>}
				{nextUrl && <Button onClick={pageNext}>Next</Button>}
			</div>
		</div>
	);
}
