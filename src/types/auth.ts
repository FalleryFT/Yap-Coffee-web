export interface AdminLoginPayload {
  username: string
  password: string
}

export interface AdminUser {
  id: number
  name: string
  username: string
  role: 'admin'
}

export interface AdminLoginResult {
  token: string
  user: AdminUser
}
