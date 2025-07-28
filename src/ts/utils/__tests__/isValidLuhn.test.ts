import isValidLuhn from '../isValidLuhn';

describe('Функция isValidLuhn()', () => {
  describe('валидные номера карт', () => {
    test.each([
      ['4532015112830366', 'Visa'],
      ['6011000990139424', 'Discover'],
      ['371449635398431', 'Amex'],
    ])(
      'возвращает true для действительного номера карты %s (%s)',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(true)
    );

    test.each([
      ['4532 0151 1283 0366'],
      ['6011 0009 9013 9424'],
      ['3714 496353 98431'],
    ])(
      'возвращает true для действительного номера карты с пробелами: %s',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(true)
    );

    test.each([
      ['4532-0151-1283-0366'],
      ['6011-0009-9013-9424'],
      ['3714-496353-98431'],
    ])(
      'возвращает true для действительного номера карты с дефисами: %s',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(true)
    );
  });

  describe('невалидные номера карт', () => {
    test.each([
      ['4532015112830367'],
      ['6011000990139425'],
      ['371449635398432'],
    ])('возвращает false при вводе неверного номера карты: %s', (cardNumber) =>
      expect(isValidLuhn(cardNumber)).toBe(false)
    );

    test.each([['4532-0151-1283-0367']])(
      'возвращает false при неверном формате номера карты: %s',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(false)
    );
  });

  describe('крайние случаи', () => {
    test.each([[''], ['4'], [' '], ['a']])(
      'возвращает false для строк, содержащих менее 2 цифр или не являющихся цифрами: "%s"',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(false)
    );

    test.each([['abcd'], ['!@#$']])(
      'возвращает false для строк, содержащих только нецифровые символы: "%s"',
      (cardNumber) => expect(isValidLuhn(cardNumber)).toBe(false)
    );
  });
});
