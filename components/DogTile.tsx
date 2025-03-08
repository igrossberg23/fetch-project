import { Dog } from '@/types/general';
import {
	Star,
	StarBorder,
	StarOutline,
	StartOutlined,
} from '@mui/icons-material';
import Image from 'next/image';
import { useState } from 'react';

export default function DogTile({ dog }: { dog: Dog }) {
	const [isFavorite, setIsFavorite] = useState(false);

	const handleClick = () => {
		setIsFavorite((prev) => !prev);
	};

	return (
		<div
			className='group cursor-pointer flex flex-col bg-neutral-400 rounded-xl w-48 shadow-md hover:shadow-xl'
			onClick={handleClick}
		>
			<div className='relative flex-shrink-0 flex-grow overflow-hidden rounded-tl-xl rounded-tr-xl w-48 h-40'>
				<div className='absolute top-2 right-2 text-amber-400 z-10 rounded-full bg-neutral-700'>
					{isFavorite ? <Star /> : <StarBorder />}
				</div>
				<Image
					src={dog.img}
					alt={'Dog with id ' + dog.id}
					className='relative object-cover group-hover:scale-105'
					fill
					sizes={'200px'}
				/>
			</div>
			<div className='flex flex-col p-2'>
				<div className='flex justify-between'>
					<div className='text-xl font-bold'>{dog.name}</div>
					<div className='text-sm italic'>{dog.age} years old</div>
				</div>
				<div className='text-xs italic uppercase'>{dog.breed}</div>
				<div>
					<span>Zip Code: </span>
					{dog.zip_code}
				</div>
			</div>
		</div>
	);
}
