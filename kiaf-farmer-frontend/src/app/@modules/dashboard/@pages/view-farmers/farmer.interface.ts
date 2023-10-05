
export interface Created_by {
	email: string;
	name: string;
	profile_image: string;
}

export interface Crop {
	crop_id: number;
	area: string;
	crop_name: string;
}

export interface Live_stock {
	live_stock_id: number;
	count: number;
	live_stock_name: string;
}

export interface FarmerData {
	id: number;
	form_no: string;
	first_name: string;
	fathers_name: string;
	family_name: string;
	address: string;
	village: string;
	mobile_nos: string;
	survey_no: string;
	landline: string;
	email_id: string;
	age: number;
	irrigated_farm_area: string;
	non_irrigated_farm_area: string;
	non_farm_land: string;
	co_operative_name: string;
	step_completed: number;
	created_by: Created_by;
	created_at: number;
	crops: Crop[];
	live_stocks: Live_stock[];
	discard:boolean;
	mobile_nos_verified: boolean;
	number_of_otp_retry_allowed: number;
}

export interface FarmerApiResponse {
  count: number;
  next: string;
  previous?: any;
  results: FarmerData[];
}
