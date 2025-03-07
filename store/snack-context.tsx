import { Close } from '@mui/icons-material';
import { Alert, AlertColor, IconButton, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';

const initSnack = {
	setSnackState: ({
		open,
		message,
		severity,
		id,
	}: {
		open: boolean;
		message: string;
		severity: AlertColor;
		id: number;
	}) => {},
	alert: (severity: AlertColor, message: string) => {},
	clearSnackLog: () => {},
	snackLog: [] as { message: string; severity: AlertColor; ts: number }[],
};

export const SnackContext = React.createContext(initSnack);

export default function SnackContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [snackState, setSnackState] = useState({
		open: false,
		message: '',
		severity: 'success',
		id: 0,
	});
	const [snackLog, setSnackLog] = useState<
		{ message: string; severity: AlertColor; ts: number }[]
	>([]);

	const closeSnack = () => setSnackState((prev) => ({ ...prev, open: false }));

	const alert = useCallback((severity: AlertColor, message: string) => {
		const ts = Date.now();
		setSnackState({ open: true, message, severity, id: ts });
		setSnackLog((prev) => prev.concat([{ message, severity, ts }]));
	}, []);

	const clearSnackLog = () => setSnackLog([]);

	return (
		<>
			<SnackContext.Provider
				value={{ setSnackState, alert, clearSnackLog, snackLog }}
			>
				{children}
			</SnackContext.Provider>
			<Snackbar
				open={snackState.open}
				autoHideDuration={6000}
				onClose={closeSnack}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				action={
					<IconButton onClick={closeSnack}>
						<Close />
					</IconButton>
				}
			>
				<Alert
					onClose={closeSnack}
					severity={snackState.severity as AlertColor}
				>
					{snackState.message}
				</Alert>
			</Snackbar>
		</>
	);
}
