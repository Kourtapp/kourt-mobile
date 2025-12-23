/**
 * Input Validation Utility
 * Validates and sanitizes user input to prevent XSS, injection attacks
 */

// Maximum lengths for different field types
export const MAX_LENGTHS = {
    NAME: 100,
    EMAIL: 254,
    BIO: 500,
    DESCRIPTION: 2000,
    ADDRESS: 200,
    PHONE: 20,
    CPF: 14,
    PASSWORD: 128,
    SEARCH_QUERY: 100,
    MESSAGE: 5000,
    TITLE: 150,
} as const;

// Regex patterns for validation
const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_BR: /^\(?[1-9]{2}\)?\s?[9]?[0-9]{4}-?[0-9]{4}$/,
    NAME: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    NO_SCRIPT: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    NO_HTML: /<[^>]*>/g,
    SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/gi,
};

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(input: string): string {
    if (!input) return '';

    return input
        .replace(PATTERNS.NO_SCRIPT, '') // Remove script tags
        .replace(PATTERNS.NO_HTML, '')   // Remove HTML tags
        .trim();
}

/**
 * Check for potential SQL injection patterns
 */
export function hasSQLInjection(input: string): boolean {
    // Reset lastIndex due to global flag to ensure consistent results
    PATTERNS.SQL_INJECTION.lastIndex = 0;
    return PATTERNS.SQL_INJECTION.test(input);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email) {
        return { valid: false, error: 'Email é obrigatório' };
    }

    if (email.length > MAX_LENGTHS.EMAIL) {
        return { valid: false, error: 'Email muito longo' };
    }

    if (!PATTERNS.EMAIL.test(email)) {
        return { valid: false, error: 'Formato de email inválido' };
    }

    return { valid: true };
}

/**
 * Validate name
 */
export function validateName(name: string): { valid: boolean; error?: string } {
    if (!name) {
        return { valid: false, error: 'Nome é obrigatório' };
    }

    const sanitized = sanitizeString(name);

    if (sanitized.length < 2) {
        return { valid: false, error: 'Nome muito curto' };
    }

    if (sanitized.length > MAX_LENGTHS.NAME) {
        return { valid: false, error: 'Nome muito longo' };
    }

    if (!PATTERNS.NAME.test(sanitized)) {
        return { valid: false, error: 'Nome contém caracteres inválidos' };
    }

    return { valid: true };
}

/**
 * Validate Brazilian phone number
 */
export function validatePhoneBR(phone: string): { valid: boolean; error?: string } {
    if (!phone) {
        return { valid: false, error: 'Telefone é obrigatório' };
    }

    const numbers = phone.replace(/\D/g, '');

    if (numbers.length < 10 || numbers.length > 11) {
        return { valid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
    }

    return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
    valid: boolean;
    error?: string;
    strength: 'weak' | 'medium' | 'strong';
} {
    if (!password) {
        return { valid: false, error: 'Senha é obrigatória', strength: 'weak' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Senha deve ter no mínimo 8 caracteres', strength: 'weak' };
    }

    if (password.length > MAX_LENGTHS.PASSWORD) {
        return { valid: false, error: 'Senha muito longa', strength: 'weak' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return {
            valid: false,
            error: 'Senha deve conter maiúscula, minúscula e número',
            strength: 'weak'
        };
    }

    // Check for common weak passwords
    const commonPasswords = ['12345678', 'password', 'qwerty123', 'abc12345'];
    if (commonPasswords.includes(password.toLowerCase())) {
        return { valid: false, error: 'Senha muito comum', strength: 'weak' };
    }

    const strength = hasSpecial && password.length >= 12 ? 'strong' : 'medium';

    return { valid: true, strength };
}

/**
 * Validate bio/description text
 */
export function validateBio(bio: string): { valid: boolean; error?: string; sanitized: string } {
    if (!bio) {
        return { valid: true, sanitized: '' };
    }

    const sanitized = sanitizeString(bio);

    if (sanitized.length > MAX_LENGTHS.BIO) {
        return { valid: false, error: 'Bio muito longa (máx 500 caracteres)', sanitized };
    }

    if (hasSQLInjection(sanitized)) {
        return { valid: false, error: 'Texto contém caracteres inválidos', sanitized: '' };
    }

    return { valid: true, sanitized };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): { valid: boolean; sanitized: string } {
    if (!query) {
        return { valid: true, sanitized: '' };
    }

    const sanitized = sanitizeString(query).slice(0, MAX_LENGTHS.SEARCH_QUERY);

    if (hasSQLInjection(sanitized)) {
        return { valid: false, sanitized: '' };
    }

    return { valid: true, sanitized };
}

/**
 * Validate message content
 */
export function validateMessage(message: string): { valid: boolean; error?: string; sanitized: string } {
    if (!message) {
        return { valid: false, error: 'Mensagem vazia', sanitized: '' };
    }

    const sanitized = sanitizeString(message);

    if (sanitized.length > MAX_LENGTHS.MESSAGE) {
        return { valid: false, error: 'Mensagem muito longa', sanitized };
    }

    return { valid: true, sanitized };
}

/**
 * Sanitize object properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

/**
 * Validate and sanitize profile update data
 */
export function validateProfileUpdate(data: {
    name?: string;
    bio?: string;
    phone?: string;
}): { valid: boolean; errors: string[]; sanitized: typeof data } {
    const errors: string[] = [];
    const sanitized: typeof data = {};

    if (data.name !== undefined) {
        const nameResult = validateName(data.name);
        if (!nameResult.valid) {
            errors.push(nameResult.error!);
        } else {
            sanitized.name = sanitizeString(data.name);
        }
    }

    if (data.bio !== undefined) {
        const bioResult = validateBio(data.bio);
        if (!bioResult.valid) {
            errors.push(bioResult.error!);
        }
        sanitized.bio = bioResult.sanitized;
    }

    if (data.phone !== undefined) {
        const phoneResult = validatePhoneBR(data.phone);
        if (!phoneResult.valid) {
            errors.push(phoneResult.error!);
        } else {
            sanitized.phone = data.phone.replace(/\D/g, '');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        sanitized,
    };
}
