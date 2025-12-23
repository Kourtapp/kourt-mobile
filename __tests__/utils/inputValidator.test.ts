import {
  sanitizeString,
  hasSQLInjection,
  validateEmail,
  validateName,
  validatePassword,
  validateBio,
  validateSearchQuery,
  validateMessage,
  validatePhoneBR,
  validateProfileUpdate,
  MAX_LENGTHS,
} from '../../utils/inputValidator';

describe('Input Validator', () => {
  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      const result = sanitizeString(input);

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
      expect(result).toBe('Hello  World');
    });

    it('should remove HTML tags', () => {
      const input = 'Hello <b>World</b>';
      const result = sanitizeString(input);

      expect(result).not.toContain('<b>');
      expect(result).not.toContain('</b>');
      expect(result).toBe('Hello World');
    });

    it('should remove img tags with onerror', () => {
      const input = '<img src=x onerror=alert(1)>';
      const result = sanitizeString(input);

      expect(result).not.toContain('<img');
      expect(result).not.toContain('onerror');
      expect(result).toBe('');
    });

    it('should handle multiple XSS attempts', () => {
      const input = '<script>alert(1)</script><img src=x onerror=alert(2)><div onclick="alert(3)">Click</div>';
      const result = sanitizeString(input);

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('<div');
      expect(result).not.toContain('onclick');
    });

    it('should trim whitespace', () => {
      const input = '   Hello World   ';
      const result = sanitizeString(input);

      expect(result).toBe('Hello World');
    });

    it('should handle empty string', () => {
      const result = sanitizeString('');
      expect(result).toBe('');
    });

    it('should preserve safe content', () => {
      const input = 'This is a safe string with numbers 123 and special chars !@#';
      const result = sanitizeString(input);

      expect(result).toBe(input.trim());
    });
  });

  describe('hasSQLInjection', () => {
    it('should detect SELECT statement', () => {
      expect(hasSQLInjection('SELECT * FROM users')).toBe(true);
      expect(hasSQLInjection('select * from users')).toBe(true);
    });

    it('should detect INSERT statement', () => {
      expect(hasSQLInjection('INSERT INTO users')).toBe(true);
      expect(hasSQLInjection('insert into users')).toBe(true);
    });

    it('should detect UPDATE statement', () => {
      expect(hasSQLInjection('UPDATE users SET')).toBe(true);
    });

    it('should detect DELETE statement', () => {
      expect(hasSQLInjection('DELETE FROM users')).toBe(true);
    });

    it('should detect DROP statement', () => {
      expect(hasSQLInjection('DROP TABLE users')).toBe(true);
    });

    it('should detect UNION statement', () => {
      expect(hasSQLInjection('1 UNION SELECT')).toBe(true);
    });

    it('should detect multiple SQL keywords', () => {
      expect(hasSQLInjection('SELECT * FROM users; DROP TABLE users;')).toBe(true);
    });

    it('should return false for safe strings', () => {
      expect(hasSQLInjection('Hello World')).toBe(false);
      expect(hasSQLInjection('User input text')).toBe(false);
      expect(hasSQLInjection('Beach Tennis player')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject email without @', () => {
      const result = validateEmail('invalidemail.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('test@');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('should reject email without username', () => {
      const result = validateEmail('@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('should reject very long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('longo');
    });
  });

  describe('validateName', () => {
    it('should validate correct name', () => {
      const result = validateName('John Doe');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate name with accents', () => {
      const result = validateName('José María');
      expect(result.valid).toBe(true);
    });

    it('should validate name with apostrophe', () => {
      const result = validateName("O'Brien");
      expect(result.valid).toBe(true);
    });

    it('should validate name with hyphen', () => {
      const result = validateName('Anne-Marie');
      expect(result.valid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validateName('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject very short name', () => {
      const result = validateName('A');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('curto');
    });

    it('should reject very long name', () => {
      const longName = 'A'.repeat(MAX_LENGTHS.NAME + 1);
      const result = validateName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('longo');
    });

    it('should reject name with numbers', () => {
      const result = validateName('John123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('caracteres inválidos');
    });

    it('should reject name with special characters', () => {
      const result = validateName('John@Doe');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('caracteres inválidos');
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should validate medium password', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('maiúscula');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('minúscula');
    });

    it('should reject password without number', () => {
      const result = validatePassword('PasswordABC');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('número');
    });

    it('should reject very short password', () => {
      const result = validatePassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('8 caracteres');
    });

    it('should reject very long password', () => {
      const longPassword = 'Pass123!' + 'a'.repeat(MAX_LENGTHS.PASSWORD);
      const result = validatePassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('longa');
    });

    it('should reject common passwords', () => {
      expect(validatePassword('12345678').valid).toBe(false);
      expect(validatePassword('password').valid).toBe(false);
      expect(validatePassword('qwerty123').valid).toBe(false);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatória');
    });

    it('should rate password with special chars as strong', () => {
      const result = validatePassword('VeryStrong123!@#');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
    });
  });

  describe('validateBio', () => {
    it('should validate correct bio', () => {
      const result = validateBio('Beach tennis player from Brazil');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Beach tennis player from Brazil');
    });

    it('should allow empty bio', () => {
      const result = validateBio('');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('');
    });

    it('should sanitize bio with HTML', () => {
      const result = validateBio('Player <b>pro</b>');
      expect(result.valid).toBe(true);
      expect(result.sanitized).not.toContain('<b>');
    });

    it('should reject very long bio', () => {
      const longBio = 'A'.repeat(MAX_LENGTHS.BIO + 1);
      const result = validateBio(longBio);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('longa');
    });

    it('should reject bio with SQL injection', () => {
      const result = validateBio('Player SELECT * FROM users');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('caracteres inválidos');
    });
  });

  describe('validateSearchQuery', () => {
    it('should validate safe search query', () => {
      const result = validateSearchQuery('beach tennis');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('beach tennis');
    });

    it('should allow empty query', () => {
      const result = validateSearchQuery('');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('');
    });

    it('should sanitize query with HTML', () => {
      const result = validateSearchQuery('search <script>alert(1)</script>');
      expect(result.valid).toBe(true);
      expect(result.sanitized).not.toContain('<script>');
    });

    it('should reject SQL injection in query', () => {
      const result = validateSearchQuery('SELECT * FROM users');
      expect(result.valid).toBe(false);
      expect(result.sanitized).toBe('');
    });

    it('should truncate very long query', () => {
      const longQuery = 'a'.repeat(MAX_LENGTHS.SEARCH_QUERY + 50);
      const result = validateSearchQuery(longQuery);
      expect(result.sanitized.length).toBeLessThanOrEqual(MAX_LENGTHS.SEARCH_QUERY);
    });
  });

  describe('validateMessage', () => {
    it('should validate normal message', () => {
      const result = validateMessage('Hello, how are you?');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Hello, how are you?');
    });

    it('should reject empty message', () => {
      const result = validateMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('vazia');
    });

    it('should sanitize message with HTML', () => {
      const result = validateMessage('Hello <b>friend</b>');
      expect(result.valid).toBe(true);
      expect(result.sanitized).not.toContain('<b>');
    });

    it('should reject very long message', () => {
      const longMessage = 'A'.repeat(MAX_LENGTHS.MESSAGE + 1);
      const result = validateMessage(longMessage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('longa');
    });
  });

  describe('validatePhoneBR', () => {
    it('should validate 11-digit phone', () => {
      const result = validatePhoneBR('11987654321');
      expect(result.valid).toBe(true);
    });

    it('should validate 10-digit phone', () => {
      const result = validatePhoneBR('1134567890');
      expect(result.valid).toBe(true);
    });

    it('should validate formatted phone', () => {
      const result = validatePhoneBR('(11) 98765-4321');
      expect(result.valid).toBe(true);
    });

    it('should reject empty phone', () => {
      const result = validatePhoneBR('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject phone with less than 10 digits', () => {
      const result = validatePhoneBR('123456789');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 ou 11 dígitos');
    });

    it('should reject phone with more than 11 digits', () => {
      const result = validatePhoneBR('123456789012');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 ou 11 dígitos');
    });
  });

  describe('validateProfileUpdate', () => {
    it('should validate complete profile update', () => {
      const data = {
        name: 'John Doe',
        bio: 'Beach tennis player',
        phone: '11987654321',
      };

      const result = validateProfileUpdate(data);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitized.name).toBe('John Doe');
      expect(result.sanitized.bio).toBe('Beach tennis player');
      expect(result.sanitized.phone).toBe('11987654321');
    });

    it('should validate partial profile update', () => {
      const data = {
        name: 'John Doe',
      };

      const result = validateProfileUpdate(data);

      expect(result.valid).toBe(true);
      expect(result.sanitized.name).toBe('John Doe');
      expect(result.sanitized.bio).toBeUndefined();
    });

    it('should sanitize all fields', () => {
      const data = {
        name: 'John <script>alert(1)</script>',
        bio: '<b>Player</b>',
      };

      const result = validateProfileUpdate(data);

      expect(result.sanitized.name).not.toContain('<script>');
      expect(result.sanitized.bio).not.toContain('<b>');
    });

    it('should collect multiple errors', () => {
      const data = {
        name: 'A', // Too short
        bio: 'A'.repeat(600), // Too long
        phone: '123', // Too short
      };

      const result = validateProfileUpdate(data);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should handle empty data', () => {
      const result = validateProfileUpdate({});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should remove non-digit characters from phone', () => {
      const data = {
        phone: '(11) 98765-4321',
      };

      const result = validateProfileUpdate(data);

      expect(result.valid).toBe(true);
      expect(result.sanitized.phone).toBe('11987654321');
    });
  });

  describe('MAX_LENGTHS constants', () => {
    it('should have defined max lengths', () => {
      expect(MAX_LENGTHS.NAME).toBe(100);
      expect(MAX_LENGTHS.EMAIL).toBe(254);
      expect(MAX_LENGTHS.BIO).toBe(500);
      expect(MAX_LENGTHS.PASSWORD).toBe(128);
      expect(MAX_LENGTHS.SEARCH_QUERY).toBe(100);
      expect(MAX_LENGTHS.MESSAGE).toBe(5000);
    });
  });
});
