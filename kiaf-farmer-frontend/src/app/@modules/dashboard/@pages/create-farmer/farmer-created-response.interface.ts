export interface CreatedBy {
    email: string;
    name: string;
    profile_image: string;
}
export interface Crop {
    crop_id: number;
    area: string;
    crop_name: string;
}
export interface LiveStock {
    live_stock_id: number;
    count: number;
    live_stock_name: string;
}
export interface FarmerCreatedResponse {
    id: number;
    form_no: string;
    first_name: string;
    fathers_name: string;
    family_name: string;
    address: string;
    village: string;
    mobile_nos: string;
    survey_no: string;
    pin_code: string;
    landline: string;
    email_id: string;
    age: number;
    irrigated_farm_area: string;
    non_irrigated_farm_area: string;
    non_farm_land: string;
    co_operative_name: string;
    step_completed: number;
    created_by: CreatedBy;
    created_at: string;
    crops: Crop[];
    live_stocks: LiveStock[];
    discard: boolean;
}