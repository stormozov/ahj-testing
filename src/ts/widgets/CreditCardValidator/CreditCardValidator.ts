import { ECardType } from './types/enums';

// Обновлённые паттерны, охватывающие диапазоны из таблицы
const cardPatterns: Record<ECardType, RegExp> = {
  // Visa: Начинается с 4, длина 13, 16 или 19
  [ECardType.Visa]: /^4[0-9]{12}([0-9]{3})?([0-9]{3})?$/, // 13, 16, 19

  // Mastercard: 51-55 или 222100-272099, длина 16
  // Упрощённый паттерн, охватывающий основные диапазоны (2221-2720 и 51-55)
  [ECardType.Mastercard]: /^(5[1-5][0-9]{2}|2[2-7][0-9]{2})[0-9]{12}$/, // 16

  // American Express: 34 или 37, длина 15
  [ECardType.Amex]: /^3[47][0-9]{13}$/, // 15

  // Discover: 6011, 622126-622925, 644-649, 65, длина 16-19
  // Паттерн для длины 16 (как в исходном коде)
  [ECardType.Discover]:
    /^(6011[0-9]{12}|65[0-9]{14}|64[4-9][0-9]{13}|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5])[0-9]{10})$/, // 16

  // Mir: 2200-2204, длина 16
  [ECardType.Mir]: /^220[0-4][0-9]{12}$/, // 16

  // Diners Club: 300-305, 36, 54, длина 14 или 16
  // Паттерн для длины 14 и 16 (как в исходном коде, предполагая 16 для 36 и 54)
  [ECardType.DinersClub]: /^(30[0-5][0-9]{11}|36[0-9]{12}|54[0-9]{14})$/, // 14, 16

  // JCB: 3528-3589, длина 16-19
  // Паттерн для длины 16 (как в исходном коде)
  [ECardType.Jcb]: /^35(2[89]|[3-8][0-9])[0-9]{12}$/, // 16
};

/**
 * Проверяет номер кредитной карты по алгоритму Луна.
 * @param cardNumber Номер карты в виде строки. Может содержать пробелы.
 * @returns true, если номер валиден по алгоритму Луна, иначе false.
 */
export function isValidLuhn(cardNumber: string): boolean {
  // 1. Удалить все пробелы и проверить, что остались только цифры
  const cleanedNumber = cardNumber.replace(/\s+/g, '');

  // Проверка на пустую строку и наличие только цифр
  if (!cleanedNumber || !/^\d+$/.test(cleanedNumber)) {
    return false;
  }

  let sum = 0;
  const digits = cleanedNumber.split('').map(Number); // Преобразуем в массив чисел
  const len = digits.length;

  // 2. Начинаем с правой цифры (последняя цифра - это check digit)
  // Проходим по цифрам справа налево
  for (let i = len - 1; i >= 0; i--) {
    let digit = digits[i];

    // 3. Определяем позицию: четная или нечетная (считая с 1 с конца)
    // len - i дает позицию с 1 (1 - последняя цифра, 2 - предпоследняя и т.д.)
    // Нам нужно удвоить цифры на нечетных позициях (1, 3, 5...)
    // В коде проверяем четность (len - i) % 2, чтобы удвоить цифры на позициях 2, 4, 6...,
    // которые в оригинальной строке стоят на нечетных местах (с конца).
    if ((len - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  // 4. Номер валиден, если сумма делится на 10 без остатка
  return sum % 10 === 0;
}

/**
 * Валидирует номер кредитной карты.
 *
 * @param form HTMLFormElement, содержащая поля для ввода данных карты.
 */
export function validateCreditCard(form: HTMLFormElement): void {
  if (!form) {
    alert('Форма не найдена');
    return;
  }

  // Get selected payment method radio input
  const selectedPaymentMethodInput = form.querySelector(
    'input[name="payment-method"]:checked'
  ) as HTMLInputElement | null;

  if (!selectedPaymentMethodInput) {
    alert('Пожалуйста, выберите тип карты');
    return;
  }

  // Предполагается, что ID имеет формат типа 'payment-method-visa'
  // или 'payment-method-mastercard-something'
  const paymentMethodId = selectedPaymentMethodInput.id.replace(
    'payment-method-',
    ''
  );
  // Извлекаем тип, предполагая, что он идёт первым словом
  const paymentMethodKey = paymentMethodId
    .split('-')[0]
    .toLowerCase() as ECardType;

  // Проверяем, существует ли такой тип в enum
  if (!Object.values(ECardType).includes(paymentMethodKey)) {
    alert('Неизвестный тип карты');
    return;
  }

  // Get card number input
  const cardNumberInput = form.querySelector(
    `input[type="text"].credit-card-form__input, input[type="number"].credit-card-form__input`
  ) as HTMLInputElement | null; // Добавил type="text" на случай, если номер содержит не только цифры

  if (!cardNumberInput) {
    alert('Поле для номера карты не найдено');
    return;
  }

  const cardNumber = cardNumberInput.value; // Не удаляем пробелы сразу, isValidLuhn это сделает

  if (!cardNumber.trim()) {
    // Проверяем на пустоту после trim
    alert('Пожалуйста, введите номер карты');
    return;
  }

  // Validate card number pattern for selected payment method
  const pattern = cardPatterns[paymentMethodKey]; // Используем paymentMethodKey
  if (!pattern) {
    // Эта проверка вряд ли понадобится, так как мы уже проверили на includes, но пусть будет
    alert('Неизвестный тип карты (паттерн не найден)');
    return;
  }

  // Сначала проверяем формат (паттерн)
  const cleanedCardNumberForPatternCheck = cardNumber.replace(/\s+/g, ''); // Убираем пробелы для проверки паттерна
  if (!pattern.test(cleanedCardNumberForPatternCheck)) {
    alert('Неверный номер карты для выбранного типа');
    return;
  }

  // Затем проверяем по алгоритму Луна
  if (!isValidLuhn(cardNumber)) {
    // Передаём исходную строку с пробелами
    alert('Номер карты не прошёл проверку по алгоритму Луна');
    return;
  }

  alert('Номер карты валиден');
}
