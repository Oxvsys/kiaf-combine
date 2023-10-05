export interface User {
  email: string;
  exp: number;
  jti: string;
  name: string;
  profile_image: string;
  token_type: string;
  user_type: string;
  auth_provider: string;
  user_id: number;
}

export enum USER_TYPE{
  agent = "agent",
  agentAdmin = "agent_admin",
}