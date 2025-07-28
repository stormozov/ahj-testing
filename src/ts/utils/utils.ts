/**
 * Проверяет номер кредитной карты по алгоритму Луна.
 *
 * @param {string} cardNumber - Номер карты в виде строки. Может содержать пробелы.
 *
 * @returns {boolean} true, если номер валиден по алгоритму Луна, иначе false.
 */
export function isValidLuhn(cardNumber: string): boolean {
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

/**
 * Вспомогательная функция для отображения сообщения.
 *
 * @param {HTMLDivElement | undefined} messageBlock - Элемент для отображения сообщения.
 * @param {string} message - Сообщение для отображения.
 * @param {boolean} isError - Является ли сообщение об ошибке.
 */
export function displayMessage(
  messageBlock: HTMLDivElement | undefined,
  message: string,
  isError: boolean = true
): void {
  if (messageBlock) {
    messageBlock.textContent = message;
    messageBlock.style.display = 'block';
    messageBlock.style.color = isError ? 'red' : 'green';
  } else {
    // Альтернативный способ отображения сообщения, если блок не предоставлен
    alert(message);
  }
}
