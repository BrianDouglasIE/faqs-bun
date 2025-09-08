/* GENERATED FILE CONTENT DO NOT EDIT */

export type migrations_table = { 
  id: number;
  name: string;
  created_at: string
}

export type sqlite_sequence_table = { 
  name: any;
  seq: any
}

export type users_table = { 
  id: number;
  email: string;
  created_at: string
}

export type projects_table = { 
  id: number;
  name: string;
  created_at: string
}

export type project_users_table = { 
  project_id: number;
  user_id: number;
  role: string;
  created_at: string
}

export type questions_table = { 
  id: number;
  text: string;
  project_id: number;
  user_id: number;
  created_at: string
}

export type answers_table = { 
  id: number;
  text: string;
  question_id: number;
  user_id: number;
  created_at: string
}

export type user_auth_details_table = { 
  id: number;
  user_id: number;
  hash: string;
  salt: string;
  iterations: number;
  failed_attempts: number;
  lock_until: number
}

export type user_sessions_table = { 
  token: string;
  user_id: number;
  expires: number
}

