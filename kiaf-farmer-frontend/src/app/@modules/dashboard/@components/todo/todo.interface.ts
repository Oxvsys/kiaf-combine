export interface TodoCreate {
	task: string;
	completed: boolean;
}

export interface TodoResponse {
	count: number;
	next: string;
	previous?: any;
	results: TodoResult[];
}

export interface TodoResult {
	id?: number;
	task: string;
	created_at: string;
	updated_at: string;
	completed: boolean;
	user: string;
}