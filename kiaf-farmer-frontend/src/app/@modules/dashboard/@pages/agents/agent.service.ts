import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Agents } from "./agents.component";

@Injectable()
export class AgentService {
    constructor(private http: HttpClient) {
    }

    getAgent() {
        return this.http.get<Agents[]>(environment.baseUrl + '/api/v1/user/agent_details/');
    }

    updateAgent(data: Agents) {
        return this.http.patch<Agents>(environment.baseUrl + '/api/v1/user/agent_details/' + data.id + '/', { is_active: !data.is_active });
    }
}