/**
 * Validation rules and utilities for all forms in the project.
 * Error messages are in French as requested.
 */

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-]{8,}$/, // Basic international support
};

export const ERROR_MESSAGES = {
  REQUIRED: "Ce champ est obligatoire",
  EMAIL_INVALID: "Format d'email invalide",
  PASSWORD_STRENGTH: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial",
  PASSWORD_MATCH: "Les mots de passe ne correspondent pas",
  MIN_LENGTH: (min: number) => `Minimum ${min} caractères requis`,
  MAX_LENGTH: (max: number) => `Maximum ${max} caractères autorisés`,
  MIN_VALUE: (min: number) => `La valeur minimale est ${min}`,
  MAX_VALUE: (max: number) => `La valeur maximale est ${max}`,
  PHONE_INVALID: "Numéro de téléphone invalide",
  DATE_INVALID: "Date invalide",
};

export type ValidationRule = (value: any, formData?: any) => string | null;

export const validators = {
  required: (value: any): string | null => {
    if (value === undefined || value === null || value === "") return ERROR_MESSAGES.REQUIRED;
    if (Array.isArray(value) && value.length === 0) return ERROR_MESSAGES.REQUIRED;
    if (typeof value === "boolean" && !value) return ERROR_MESSAGES.REQUIRED;
    return null;
  },
  email: (value: string): string | null => {
    if (!value) return null;
    return VALIDATION_RULES.EMAIL.test(value) ? null : ERROR_MESSAGES.EMAIL_INVALID;
  },
  password: (value: string): string | null => {
    if (!value) return null;
    return VALIDATION_RULES.PASSWORD.test(value) ? null : ERROR_MESSAGES.PASSWORD_STRENGTH;
  },
  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null;
    return value.length >= min ? null : ERROR_MESSAGES.MIN_LENGTH(min);
  },
  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null;
    return value.length <= max ? null : ERROR_MESSAGES.MAX_LENGTH(max);
  },
  minValue: (min: number) => (value: number): string | null => {
    if (value === undefined || value === null) return null;
    return value >= min ? null : ERROR_MESSAGES.MIN_VALUE(min);
  },
  maxValue: (max: number) => (value: number): string | null => {
    if (value === undefined || value === null) return null;
    return value <= max ? null : ERROR_MESSAGES.MAX_VALUE(max);
  },
  phone: (value: string): string | null => {
    if (!value) return null;
    return VALIDATION_RULES.PHONE.test(value) ? null : ERROR_MESSAGES.PHONE_INVALID;
  },
  matches: (otherFieldName: string, message?: string) => (value: any, formData: any): string | null => {
    return value === formData[otherFieldName] ? null : (message || ERROR_MESSAGES.PASSWORD_MATCH);
  },
};
