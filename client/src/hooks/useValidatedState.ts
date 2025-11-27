import { useState, useRef } from "react";
import { ValidatedStateResponse } from "../types/types";
/**
 * A custom hook that manages a state with validation and doesn't show errors at first render.
 * @param initialState the initial state value
 * @param validator a function that takes the state and returns an error message if invalid, or an empty string if valid
 * @returns ValidatedStateResponse<T>  containing the state, a setter function, the current error message, and a function to check for errors
 */
export function useValidatedState<T>(initialState: T, validator: (state: T) => string): ValidatedStateResponse<T> {

  const [state, setState] = useState<T>(initialState);
  const [error, setError] = useState<string>('');
  const isFirstRender = useRef(true);

  function setValue(state: T) {
    setState(state);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      setError(validator(state));
    }
  }

  function validate() {
    const validationError = validator(state);
    setError(validationError);
    return validationError;
  }

  return { value: state, setValue, error, validate };
}