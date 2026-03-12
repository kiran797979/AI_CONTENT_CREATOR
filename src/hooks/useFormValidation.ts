import { useState, useCallback } from "react";
import type { FormData, ValidationErrors } from "../types/form";
import { validationRules } from "../types/form";

export type { ValidationErrors } from "../types/form";

export function useFormValidation(formData: FormData) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [shakeButton, setShakeButton] = useState(false);

  const validate = useCallback((): boolean => {
    const next: ValidationErrors = {};

    for (const [field, test] of Object.entries(validationRules)) {
      const error = test(formData[field as keyof FormData] as string);
      if (error) {
        next[field as keyof FormData] = error;
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      setShakeButton(true);
      setTimeout(() => setShakeButton(false), 500);
      return false;
    }

    return true;
  }, [formData]);

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { errors, shakeButton, validate, clearError };
}
