import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { AgentService } from './agent.service';

export interface Agents {
  id: number;
  email: string;
  name: string;
  profile_image: string;
  unique_id: string;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
  auth_provider: string;
}
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  constructor(private agentService: AgentService, private nbToastrService: NbToastrService) { }
  agents: Agents[] = [];

  ngOnInit(): void {
    this.agentService.getAgent().subscribe(next => {
      this.agents = next;
    })
  }

  toggleAgentActive(id: number) {
    let index = this.agents.findIndex(obj => obj.id == id);
    this.agentService.updateAgent(this.agents[index]).subscribe(next => {
      // this.nbToastrService.success("Agent made Inactive", "Agent Disable");
    })
  }



}
