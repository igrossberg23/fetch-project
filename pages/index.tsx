import DogTile from '@/components/DogTile';
import PaginationButtons from '@/components/PaginationButtons';
import { dogApi } from '@/lib/axios';
import { AuthContext } from '@/store/auth-context';
import { SnackContext } from '@/store/snack-context';
import { Dog } from '@/types/general';
import { Looks } from '@mui/icons-material';
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
	const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

	const [dogs, setDogs] = useState<Dog[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [match, setMatch] = useState<Dog>();

	const [searchUrl, setSearchUrl] = useState('/dogs/search?size=25&from=0');
	const [nextUrl, setNextUrl] = useState('');
	const [prevUrl, setPrevUrl] = useState('');
	const [isAscending, setIsAscending] = useState(true);
	const [sortField, setSortField] = useState('breed');
	const [ageRange, setAgeRange] = useState([0, 20]);
	const [total, setTotal] = useState(0);
	const [fromValue, setFromValue] = useState(0);

	const [matchLoading, setMatchLoading] = useState(false);
	const [dogSearchLoading, setDogSearchLoading] = useState(false);

	const { alert } = useContext(SnackContext);
	const { isAuthenticated, name, email } = useContext(AuthContext);

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
			const params = new URLSearchParams();
			params.append('sort', `${sortField}:${isAscending ? 'asc' : 'desc'}`);
			params.append('ageMin', `${ageRange[0]}`);
			params.append('ageMax', `${ageRange[1]}`);
			selectedBreeds.forEach((b) => params.append('breeds', b));

			const fullUrl = overrideUrl ?? searchUrl + '&' + params.toString();

			console.log(fullUrl);

			const searchRes = await dogApi.get(fullUrl);
			console.log(searchRes.data);

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

	const handleToggleFavorite = (id: string) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((f) => f != id) : [...prev, id]
		);
	};

	const handleMatch = async () => {
		if (favorites.length < 1) {
			alert('error', 'At least 1 favorite must be selected to match');
			return;
		}

		try {
			setMatchLoading(true);
			const matchRes = await dogApi.post('/dogs/match', favorites);
			const matchId: string = matchRes.data.match;

			const dogRes = await dogApi.post('/dogs', [matchId]);
			setMatch(dogRes.data[0]);
		} catch (err) {
			console.error(err);
			alert('error', 'Something went wrong while matching...Please try again.');
		} finally {
			setMatchLoading(false);
		}
	};

	const pageNext = () => fetchDogs(nextUrl);
	const pagePrev = () => fetchDogs(prevUrl);

	if (!isAuthenticated)
		return (
			<div className='w-full'>
				<MainSection>
					<SubSection className='flex flex-col gap-2'>
						<h1 className='text-4xl font-bold'>Furry Friend Finder</h1>
						<p className='text-lg'>Please log in to begin searching.</p>
						<p className='text-sm italic'>
							Login button is located in the top right of your screen.
						</p>
					</SubSection>
				</MainSection>
			</div>
		);

	return (
		<div className='flex flex-col gap-2 items-center w-full'>
			<MainSection className='flex flex-col items-start gap-4'>
				<h2 className='text-xl font-bold'>Welcome, {name}</h2>
				<ol className='list-decimal ml-4'>
					<li>
						To get started, log in by clicking the login button in the top
						right.
					</li>
					<li>Once logged in, apply any desired filters and sorting.</li>
					<li>
						View results below and select favorites by clicking on dog tiles.
					</li>
					<li>
						Once finished selecting favorites, select Match to be matched with a
						new friend!
					</li>
				</ol>
			</MainSection>
			<MainSection className='flex flex-col items-start gap-4'>
				<SubSection
					className='flex flex-col items-start gap-4'
					title='Filtering'>
					<FormControl>
						<FormLabel>Breed</FormLabel>
						<Select
							value={selectedBreeds}
							multiple
							className='max-w-40'
							onChange={(e) => {
								const newVal = e.target.value;
								setSelectedBreeds(
									typeof newVal === 'string' ? newVal.split(',') : newVal
								);
							}}>
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
							className='ml-2'
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
				</SubSection>
				<SubSection
					className='flex flex-col gap-4 items-start'
					title='Sorting'>
					<div className='flex gap-4 flex-col sm:flex-row'>
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
				</SubSection>
				<SubSection
					title='Find your match'
					className='flex flex-col gap-4 items-start'>
					<Button
						variant='contained'
						className='mt-4'
						onClick={handleMatch}
						endIcon={
							matchLoading ? (
								<Looks
									fontSize='medium'
									className='animate-spin'
								/>
							) : undefined
						}>
						Match
					</Button>
					{match && (
						<>
							<p className='mt-4'>
								You matched with <span className='font-bold'>{match.name}</span>
								!
							</p>
							<DogTile
								dog={match}
								isFavorite={false}
								toggleFavorite={() => {}}
							/>
						</>
					)}
				</SubSection>
			</MainSection>
			{dogs.length > 0 ? (
				<MainSection>
					<PaginationButtons
						showPrev={prevUrl != ''}
						showNext={nextUrl != ''}
						onClickNext={pageNext}
						onClickPrev={pagePrev}>
						<p className='italic'>
							Showing Results: {fromValue} - {fromValue + 24} of {total}
						</p>
					</PaginationButtons>
					<SubSection className='flex flex-row gap-4 flex-wrap justify-center items-center'>
						{dogs.map((d) => (
							<DogTile
								dog={d}
								key={d.id}
								isFavorite={favorites.includes(d.id)}
								toggleFavorite={handleToggleFavorite}
							/>
						))}
					</SubSection>
					<PaginationButtons
						showPrev={prevUrl != ''}
						showNext={nextUrl != ''}
						onClickNext={pageNext}
						onClickPrev={pagePrev}>
						<p className='italic'>
							Showing Results: {fromValue} - {fromValue + 24} of {total}
						</p>
					</PaginationButtons>
				</MainSection>
			) : (
				<MainSection>
					<p className='w-full text-center font-bold text-xl'>
						Log In to View Dogs
					</p>
				</MainSection>
			)}
		</div>
	);
}

function MainSection({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section
			className={`bg-neutral-300 rounded-md p-4 sm:p-8 w-full ${className ?? ''}`}>
			{children}
		</section>
	);
}

function SubSection({
	children,
	className,
	title,
}: {
	children: React.ReactNode;
	className?: string;
	title?: string;
}) {
	return (
		<div className={`bg-neutral-200 w-full rounded-md p-4 ${className ?? ''}`}>
			{title && (
				<p className='uppercase font-md font-bold tracking-tight'>{title}</p>
			)}
			{children}
		</div>
	);
}
