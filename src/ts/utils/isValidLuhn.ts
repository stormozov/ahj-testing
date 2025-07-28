/**
 * Проверяет номер кредитной карты по алгоритму Луна.
 *
 * @param {string} cardNumber - Номер карты в виде строки. Может содержать пробелы.
 *
 * @returns {boolean} true, если номер валиден по алгоритму Луна, иначе false.
 */
export default function isValidLuhn(cardNumber: string): boolean {
  const cleanedNumber = cardNumber.replace(/\D/g, ''); // Удаляем всё, кроме цифр

  if (cleanedNumber.length < 2) return false;

  let sum = 0;
  const len = cleanedNumber.length;

  for (let i = len - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);

    // Удваиваем цифры на чётных позициях с конца (1-основанный индекс)
    // len - i даёт 1-основанный индекс с конца
    if ((len - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
}
