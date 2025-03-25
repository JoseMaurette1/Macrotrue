export interface ClerkError {
  errors?: {
    message?: string;
    longMessage?: string;
    code?: string;
  }[];
  status?: number;
  message?: string;
}