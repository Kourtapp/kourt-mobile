/**
 * CPF Validator - Brazilian Individual Taxpayer Registry
 * Uses official algorithm from Receita Federal
 */

/**
 * Validates a Brazilian CPF number
 * @param cpf - CPF string (with or without formatting)
 * @returns boolean indicating if CPF is valid
 */
export function validateCPF(cpf: string): boolean {
    // Remove non-numeric characters
    const cleanCPF = cpf.replace(/\D/g, '');

    // CPF must have exactly 11 digits
    if (cleanCPF.length !== 11) {
        return false;
    }

    // Check for known invalid patterns (all same digits)
    const invalidPatterns = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ];

    if (invalidPatterns.includes(cleanCPF)) {
        return false;
    }

    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCPF.charAt(9))) {
        return false;
    }

    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCPF.charAt(10))) {
        return false;
    }

    return true;
}

/**
 * Formats a CPF string to the standard format XXX.XXX.XXX-XX
 * @param cpf - Raw CPF string
 * @returns Formatted CPF string
 */
export function formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
        return cpf;
    }

    return cleanCPF.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
    );
}

/**
 * Masks a CPF for display (shows only last 4 digits)
 * @param cpf - CPF string
 * @returns Masked CPF like ***.***.XXX-XX
 */
export function maskCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
        return '***.***.***-**';
    }

    return `***.***${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`;
}

/**
 * Removes formatting from CPF (keeps only numbers)
 * @param cpf - Formatted CPF string
 * @returns Clean CPF with only numbers
 */
export function cleanCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
}

/**
 * Validates and returns error message if invalid
 * @param cpf - CPF string
 * @returns Error message or null if valid
 */
export function getCPFError(cpf: string): string | null {
    const cleanedCPF = cpf.replace(/\D/g, '');

    if (!cleanedCPF) {
        return 'CPF é obrigatório';
    }

    if (cleanedCPF.length !== 11) {
        return 'CPF deve ter 11 dígitos';
    }

    if (!validateCPF(cleanedCPF)) {
        return 'CPF inválido';
    }

    return null;
}
