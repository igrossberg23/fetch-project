import { Dog } from '@/types/general';
import {
	AccessTime,
	LocationOn,
	Pets,
	Star,
	StarBorder,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import Image from 'next/image';

export interface DogTileProps {
	dog: Dog;
	isFavorite: boolean;
	toggleFavorite: (id: string) => void;
}

export default function DogTile({
	dog,
	isFavorite,
	toggleFavorite,
}: DogTileProps) {
	return (
		<div
			className='group cursor-pointer flex flex-col bg-neutral-400 rounded-xl w-48 shadow-md hover:shadow-xl'
			onClick={() => toggleFavorite(dog.id)}>
			<div className='relative flex-shrink-0 flex-grow overflow-hidden rounded-tl-xl rounded-tr-xl w-48 h-40'>
				<Image
					src={dog.img}
					alt={'Dog with id ' + dog.id}
					className='relative object-cover group-hover:scale-105'
					fill
					sizes={'200px'}
				/>
			</div>
			<div className='flex flex-col p-4 gap-2'>
				<Stack direction='row'>
					<div className='text-xl font-bold'>{dog.name}</div>
					{isFavorite && <Star className='text-amber-400' />}
					{!isFavorite && (
						<StarBorder className='opacity-0 text-amber-400 group-hover:opacity-100' />
					)}
				</Stack>
				<Stack
					direction='column'
					gap={1}>
					<Stack
						direction='row'
						gap={1}>
						<AccessTime />
						<p>{dog.age} years old</p>
					</Stack>
					<Stack
						direction='row'
						gap={1}>
						<Pets />
						<p>{dog.breed}</p>
					</Stack>
					<Stack
						direction='row'
						gap={1}>
						<LocationOn />
						<p>{dog.zip_code}</p>
					</Stack>
				</Stack>
			</div>
		</div>
	);
}
