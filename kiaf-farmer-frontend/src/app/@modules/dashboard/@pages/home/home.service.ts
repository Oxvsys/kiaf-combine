import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AdminStats, AgentStats } from "./home.component";

@Injectable()
export class HomeService {
    constructor(private http: HttpClient) {
    }

    getStats() {
        return this.http.get<AdminStats | AgentStats>(environment.apiUrl + "/farmer/farmer_analytics/")
    }
}