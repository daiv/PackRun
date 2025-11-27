import { HttpMethod } from '../types/types';

export const checkEmail = (email: string) => !email ? 'Email can not be empty' : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Invalid email address' : '';
export const checkNick = (nick: string) => nick ? '' : 'Nick can not be empty';
export const checkMatchingPasswords = (pass1: string) => ((pass2: string) => pass1 && pass1 === pass2 ? '' : 'Passwords does not match');
export const checkPassword = (password: string) => {
  if (!password) return 'Password can not be empty';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (! /[0-9]/.test(password)) return 'Password must contain at least one number';
  if (! /[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[^a-zA-Z0-9\s]/.test(password)) return 'Password must contain at least one special character';
  return '';
}

export const avoidFirstRender = (ref: React.RefObject<boolean>, setter: React.Dispatch<React.SetStateAction<string>>, field: string, value: string) => {
  if (ref.current) ref.current = false;
  else {
    switch (field) {
      case 'email':
        setter(checkEmail(value));
        break;
      case 'nick':
        setter(value ? '' : 'Nick can not be empty');
        break;
      case 'password':
        setter(checkPassword(value));
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  }
}

class ApiError extends Error {

  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }

}

export async function fetchFactory<T>(url: string, method: HttpMethod, token: string | null = null, body: unknown | null = null): Promise<T | null> {
  // const url = URL + endPoint;
  const initOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  if (token) {
    initOptions.headers = { ...initOptions.headers, Authorization: `Bearer ${token}` };
  }
  if (body && !['get', 'head'].includes(method.toLowerCase())) initOptions.body = JSON.stringify(body);
  try {
    const response = await fetch(url, initOptions);

    if (response.ok) return response.status === 204 ? null : await response.json();
    else {
      let errorData = null;
      let errorMessage = `Api error: ${response.status} - ${response.statusText}`;
      try {
        errorData = await response.json();
        if (errorData && errorData.message) errorMessage = errorData.message;
        else if (errorData && typeof errorData === 'object') errorMessage = 'Server responded with an error. See details below.';

      } catch (parseError: unknown) {
        console.warn(`WARN: ${method} ${url} 
        - Server returned status ${response.status} 
        but response was not valid JSON. See details below. `);
        const rawErrorText = await response.text().catch(() => null);
        if (rawErrorText) {
          errorMessage = `Raw error text from server: Status: ${response.status} See details below.`;
          console.warn(errorMessage);
        } else errorMessage = `server returned status ${response.status} but response was not valid JSON`;
        errorData = rawErrorText || { parseError: parseError instanceof Error ? parseError.message : String(parseError) };
      }

      console.error(`ERROR FETCH: ${method},  ${url} failed, status= ${response.status}`);
      console.error('Error Details:', errorData || errorMessage);
      throw new ApiError(errorMessage, response.status, errorData);

    }
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Unexpected connection error', 0, error);
  }
}

