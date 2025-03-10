import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export default function PaginationButtons({
	showPrev,
	showNext,
	onClickPrev,
	onClickNext,
	className,
	children,
}: {
	showPrev: boolean;
	showNext: boolean;
	onClickPrev: () => void;
	onClickNext: () => void;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`flex justify-between items-center self-stretch w-full ${className ?? ''}`}>
			{showPrev && (
				<IconButton onClick={onClickPrev}>
					<ArrowLeft fontSize='large' />
				</IconButton>
			)}
			{children}
			{showNext && (
				<IconButton onClick={onClickNext}>
					<ArrowRight fontSize='large' />
				</IconButton>
			)}
		</div>
	);
}
