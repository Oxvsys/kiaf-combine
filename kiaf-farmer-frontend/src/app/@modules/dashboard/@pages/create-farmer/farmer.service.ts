import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FarmerApiResponse, FarmerData } from "../view-farmers/farmer.interface";
import { FarmerCreatedResponse } from "./farmer-created-response.interface";

export interface Crop {
    id: number;
    crop_name: string;
    crop_name_mr: string;
    area: number;
}
export interface LiveStock {
    id: number;
    live_stock_name: string;
    live_stock_name_mr: string;
    count: number;
}


@Injectable()
export class FarmerService {
    constructor(private http: HttpClient) {
    }

    getAllCrops(): Observable<Crop[]> {
        return this.http.get<Crop[]>(environment.apiUrl + '/farmer/crop/');
    }
    getAllLiveStock(): Observable<LiveStock[]> {
        return this.http.get<LiveStock[]>(environment.apiUrl + '/farmer/live_stock/');
    }

    createForm(data: any) {
        return this.http.post<FarmerCreatedResponse>(environment.apiUrl + '/farmer/farmer_info/', data);
    }

    getAllFarmers(pageNumber: number, searchText: string): Observable<FarmerApiResponse> {
        return this.http.get(environment.apiUrl + '/farmer/farmer_info/', {
            params: {
                page: pageNumber.toString(),
                search: searchText
            }
        }) as Observable<FarmerApiResponse>;
    }

    toggleFarmerForm(id:number,discard:boolean) {
        return this.http.patch(environment.apiUrl + '/farmer/farmer_info/' + id + '/', {
            discard: discard
        });
    }
}