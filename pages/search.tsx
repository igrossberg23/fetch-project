import DogTile from '@/components/search/DogTile';
import PaginationButtons from '@/components/search/PaginationButtons';
import { dogApi } from '@/lib/axios';
import { AuthContext } from '@/store/auth-context';
import { SnackContext } from '@/store/snack-context';
import { Dog } from '@/types/general';
import {
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	MenuItem,
	Select,
	Slider,
	Switch,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';

export default function Search() {
	const [allBreeds, setAllBreeds] = useState<string[]>([]);
	const [selectedBreed, setSelectedBreed] = useState(' ');

	const [dogs, setDogs] = useState<Dog[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);

	const [searchUrl, setSearchUrl] = useState('/dogs/search?size=25&from=0');
	const [nextUrl, setNextUrl] = useState('');
	const [prevUrl, setPrevUrl] = useState('');
	const [isAscending, setIsAscending] = useState(true);
	const [sortField, setSortField] = useState('breed');
	const [ageRange, setAgeRange] = useState([0, 20]);
	const [total, setTotal] = useState(0);
	const [fromValue, setFromValue] = useState(0);

	const { alert } = useContext(SnackContext);
	const { isAuthenticated } = useContext(AuthContext);

	useEffect(() => {
		if (!isAuthenticated) return;
		fetchBreeds();
		fetchDogs();
	}, [isAuthenticated]);

	useEffect(() => {
		if (!searchUrl) return;

		const match = searchUrl.match(/[?&]from=(\d+)/);
		const fromValue = match?.at(1);
		setFromValue(fromValue ? Number(fromValue) : 0);
	}, [searchUrl]);

	const fetchBreeds = async () => {
		try {
			const res = await dogApi.get('/dogs/breeds');
			setAllBreeds(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchDogs = async (overrideUrl?: string) => {
		try {
			const fullUrl =
				overrideUrl ??
				searchUrl +
					`&sort=${sortField}:${isAscending ? 'asc' : 'desc'}` +
					`&ageMin=${ageRange[0]}&ageMax=${ageRange[1]}`;
			console.log(fullUrl);

			const searchRes = await dogApi.get(fullUrl);

			const match = fullUrl.match(/[?&]from=(\d+)/);
			const fromValue = match?.at(1);
			setFromValue(fromValue ? Number(fromValue) : 0);

			const resultIds = searchRes.data.resultIds;
			setNextUrl(searchRes.data.next);
			setPrevUrl(searchRes.data.prev);
			setTotal(searchRes.data.total);

			const dogRes = await dogApi.post('/dogs', resultIds);

			setDogs(dogRes.data);
		} catch (err) {
			console.error(err);
			alert(
				'error',
				'You are no longer logged in. You will need to log in again to continue viewing results.'
			);
		}
	};

	const handleSliderChange = (
		event: Event,
		newValue: number | number[],
		activeThumb: number
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		setAgeRange(newValue);
	};

	const pageNext = () => fetchDogs(nextUrl);
	const pagePrev = () => fetchDogs(prevUrl);

	return (
		<div className='flex flex-col gap-2 items-center w-full'>
			<section className='bg-neutral-300 rounded-md p-8 w-full flex flex-col items-start gap-4'>
				<h2 className='text-4xl'>Search Page</h2>
				<div className='flex flex-col items-start gap-4 bg-neutral-200 w-full rounded-md p-4'>
					<h3 className='mb-2 text-lg'>Filtering</h3>
					<FormControl>
						<FormLabel>Breed</FormLabel>
						<Select
							value={selectedBreed}
							onChange={(e) => setSelectedBreed(e.target.value)}>
							<MenuItem
								value=' '
								key=' '>
								Select A Breed
							</MenuItem>
							{allBreeds.map((breed) => (
								<MenuItem
									key={breed}
									value={breed}>
									{breed}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl>
						<FormLabel>Age Range</FormLabel>
						<Slider
							className='px-4'
							getAriaLabel={() => 'Age range'}
							value={ageRange}
							min={0}
							max={20}
							valueLabelDisplay='auto'
							onChange={handleSliderChange}
						/>
					</FormControl>
					<Button
						variant='contained'
						onClick={() => fetchDogs()}>
						Apply
					</Button>
				</div>
				<div className='flex flex-col gap-4 bg-neutral-200 w-full rounded-md p-4 items-start'>
					<h3 className='text-lg'>Sorting</h3>
					<div className='flex gap-4'>
						<Select
							value={sortField}
							onChange={(e) => setSortField(e.target.value)}>
							{['Breed', 'Name', 'Age'].map((field) => (
								<MenuItem
									key={field}
									value={field.toLowerCase()}>
									{field}
								</MenuItem>
							))}
						</Select>
						<FormControlLabel
							control={
								<Switch
									checked={isAscending}
									onChange={(e) => setIsAscending(e.target.checked)}
								/>
							}
							label={isAscending ? 'Ascending' : 'Descending'}
						/>
					</div>
					<Button
						variant='contained'
						onClick={() => fetchDogs()}>
						Apply
					</Button>
				</div>
			</section>
			{dogs.length > 0 ? (
				<section className='bg-neutral-300 rounded-md p-8 w-full'>
					<PaginationButtons
						showPrev={prevUrl != ''}
						showNext={nextUrl != ''}
						onClickNext={pageNext}
						onClickPrev={pagePrev}>
						<p>
							Showing Results: {fromValue} - {fromValue + 24} of {total}
						</p>
					</PaginationButtons>
					<div className='flex flex-row gap-4 flex-wrap w-auto mx-4 justify-center items-center bg-neutral-200 rounded-md p-4'>
						{dogs.map((d) => (
							<DogTile
								dog={d}
								key={d.id}
							/>
						))}
					</div>
					<PaginationButtons
						showPrev={prevUrl != ''}
						showNext={nextUrl != ''}
						onClickNext={pageNext}
						onClickPrev={pagePrev}>
						<p>
							Showing Results: {fromValue} - {fromValue + 24} of {total}
						</p>
					</PaginationButtons>
				</section>
			) : (
				<section className='bg-neutral-300 rounded-md p-8 w-full'>
					<p className='w-full text-center font-bold text-xl'>
						Log In to View Dogs
					</p>
				</section>
			)}
		</div>
	);
}
