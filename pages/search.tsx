import { dogApi } from '@/lib/axios';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Search() {
	const [allBreeds, setAllBreeds] = useState<string[]>([]);
	const [dogs, setDogs] = useState<Dog[]>([]);

	const [selectedBreed, setSelectedBreed] = useState(' ');

	useEffect(() => {
		fetchBreeds();
	}, []);

	const fetchBreeds = async () => {
		try {
			const res = await dogApi.get('/dogs/breeds');
			setAllBreeds(res.data);
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className='flex flex-col gap-2'>
			<h2 className='text-xl'>Search Page</h2>
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
		</div>
	);
}
