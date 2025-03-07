import axios from 'axios';

export const dogApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DOG_API_URL,
	withCredentials: true,
});
