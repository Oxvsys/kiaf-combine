
    export interface Crop {
        crop_id: number;
        area: number;
    }

    export interface LiveStock {
        live_stock_id: number;
        count: number;
    }

    export interface CreateFarmer {
        first_name: string;
        fathers_name: string;
        family_name: string;
        address: string;
        pin_code: string;
        village: string;
        mobile_nos: string;
        landline: string;
        email_id: string;
        age: number;
        irrigated_farm_area: string;
        non_irrigated_farm_area: string;
        non_farm_land: string;
        co_operative_name: string;
        survey_no: string;
        step_completed: number;
        created_by: number;
        crops: Crop[];
        live_stocks: LiveStock[];
    }
