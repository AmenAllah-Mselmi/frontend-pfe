import { useState, useCallback, useMemo } from 'react';

type ValidationResult = string | null;
type Validator = (value: any, formData: any) => ValidationResult;
type ValidationSchema = Record<string, Validator[]>;

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: any, currentValues: T) => {
      if (!validationSchema || !validationSchema[name]) return null;

      for (const validator of validationSchema[name]) {
        const error = validator(value, currentValues);
        if (error) return error;
      }
      return null;
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [name]: value };
        
        // Re-validate field on change if it has been touched or already has an error
        if (touched[name] || errors[name]) {
          const error = validateField(name, value, newValues);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error || "",
          }));
        }
        
        return newValues;
      });
    },
    [errors, touched, validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name], values);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error || "",
      }));
    },
    [validateField, values]
  );

  const validateAll = useCallback(() => {
    if (!validationSchema) return true;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((name) => {
      const error = validateField(name, values[name], values);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce((acc, name) => ({ ...acc, [name]: true }), {})
    );
    return isValid;
  }, [validateField, validationSchema, values]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (validateAll()) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    resetForm,
  };
}
