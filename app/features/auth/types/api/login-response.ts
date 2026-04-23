import type { User } from '~/shared/types/user';

export interface LoginResponse {
	user: User;
	accessToken: string;
}
