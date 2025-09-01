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
  password: string;
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

