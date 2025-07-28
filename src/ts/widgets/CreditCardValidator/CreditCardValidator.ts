import { displayMessage, isValidLuhn } from '../../utils/utils';
import { ECardType, EValidateMessageText } from './types/enums';

const cardPatterns: Record<ECardType, RegExp> = {
  // Visa: Начинается с 4, длина 13, 16 или 19
  [ECardType.Visa]: /^4[0-9]{12}([0-9]{3})?([0-9]{3})?$/, // 13, 16, 19

  // Mastercard: 51-55 или 222100-272099, длина 16
  // Упрощённый паттерн, охватывающий основные диапазоны (2221-2720 и 51-55)
  [ECardType.Mastercard]: /^(5[1-5][0-9]{2}|2[2-7][0-9]{2})[0-9]{12}$/, // 16

  // American Express: 34 или 37, длина 15
  [ECardType.Amex]: /^3[47][0-9]{13}$/, // 15

  // Discover: 6011, 622126-622925, 644-649, 65, длина 16-19
  // Паттерн для длины 16-19
  [ECardType.Discover]:
    /^(6011\d{12,15}|65\d{14,17}|64[4-9]\d{13,16}|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9[0-1]\d|92[0-5])\d{10,13})$/, // 16-19

  // Mir: 2200-2204, длина 16
  [ECardType.Mir]: /^220[0-4]\d{12}$/, // 16

  // Diners Club (объединённые диапазоны из таблицы): 300-305 (14), 36 (14), 54 (16)
  // Предполагаем, что длина может быть 14 или 16
  [ECardType.DinersClub]: /^(30[0-5]\d{11}|36\d{12}|54\d{14})$/, // 14, 16

  // JCB: 3528-3589, длина 16-19
  [ECardType.Jcb]: /^35(2[89]|[3-8]\d)\d{12,15}$/, // 16-19
};

/**
 * Валидирует номер кредитной карты.
 *
 * @param {HTMLFormElement} form - HTMLFormElement, содержащая поля для ввода данных карты.
 * @param {HTMLDivElement | undefined} messageBlock - HTMLDivElement для вывода сообщений валидации. Не обязателен.
 *
 * @returns {boolean} true, если номер карты валиден, иначе false.
 */
export function validateCreditCard(
  form: HTMLFormElement,
  messageBlock?: HTMLDivElement
): boolean {
  // --- 1. Проверка наличия формы ---
  if (!form) {
    displayMessage(messageBlock, EValidateMessageText.FormNotFound);
    return false;
  }

  // --- 2. Проверка выбора типа карты ---
  const selectedPaymentMethodInput = form.querySelector<HTMLInputElement>(
    'input[name="payment-method"]:checked'
  );

  if (!selectedPaymentMethodInput) {
    displayMessage(messageBlock, EValidateMessageText.PaymentMethodNotFound);
    return false;
  }

  // --- 3. Определение типа карты ---
  const paymentMethodId = selectedPaymentMethodInput.id.replace(
    'payment-method-',
    ''
  );
  const paymentMethodKey = paymentMethodId
    .split('-')[0]
    .toLowerCase() as ECardType;

  if (!Object.values(ECardType).includes(paymentMethodKey)) {
    displayMessage(messageBlock, EValidateMessageText.InvalidCardType);
    return false;
  }

  // --- 4. Получение номера карты ---
  const cardNumberInput = form.querySelector<HTMLInputElement>(
    'input.credit-card-form__input' // Убрано ограничение type="number"
  );

  if (!cardNumberInput) {
    displayMessage(messageBlock, EValidateMessageText.CardNumberFieldNotFound);
    return false;
  }

  const cardNumber = cardNumberInput.value;

  if (!cardNumber.trim()) {
    displayMessage(messageBlock, EValidateMessageText.InvalidCardNumber);
    return false;
  }

  // --- 5. Проверка формата по паттерну ---
  const pattern = cardPatterns[paymentMethodKey];
  if (!pattern) {
    displayMessage(messageBlock, EValidateMessageText.InvalidCardType);
    return false;
  }

  const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
  if (!pattern.test(cleanedCardNumber)) {
    displayMessage(messageBlock, EValidateMessageText.InvalidCardNumberFormat);
    return false;
  }

  // --- 6. Проверка по алгоритму Луна ---
  if (!isValidLuhn(cardNumber)) {
    // Передаём исходную строку с пробелами
    displayMessage(messageBlock, EValidateMessageText.InvalidCardNumberFormat);
    return false;
  }

  // --- 7. Успешная валидация ---
  displayMessage(messageBlock, EValidateMessageText.CorrectCardNumber, false);
  return true;
}
