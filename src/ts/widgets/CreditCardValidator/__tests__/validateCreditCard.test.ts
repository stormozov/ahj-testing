import { validateCreditCard, cardPatterns } from '../CreditCardValidator';
import * as utils from '../../../utils/utils';
import { EValidateMessageText } from '../types/enums';

jest.mock('../../../utils/utils', () => ({
  displayMessage: jest.fn(),
  isValidLuhn: jest.fn(),
}));

const { displayMessage, isValidLuhn } = utils;

function createForm({
  paymentMethodId,
  cardNumberValue,
}: {
  paymentMethodId?: string;
  cardNumberValue?: string;
}): HTMLFormElement {
  const form = document.createElement('form');

  if (paymentMethodId !== undefined) {
    const paymentMethodInput = document.createElement('input');
    paymentMethodInput.type = 'radio';
    paymentMethodInput.name = 'payment-method';
    paymentMethodInput.id = paymentMethodId;
    paymentMethodInput.checked = true;

    form.appendChild(paymentMethodInput);
  }

  if (cardNumberValue !== undefined) {
    const cardNumberInput = document.createElement('input');
    cardNumberInput.className = 'credit-card-form__input';
    cardNumberInput.value = cardNumberValue;

    form.appendChild(cardNumberInput);
  }

  return form;
}

describe('validateCreditCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('возвращает false и отображает сообщение, если форма не предоставлена', () => {
    const isValid = validateCreditCard(null as never, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.FormNotFound
    );
  });

  it('возвращает false и отображает сообщение, если не выбран способ оплаты', () => {
    const form = document.createElement('form');
    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.PaymentMethodNotFound
    );
  });

  it('возвращает false и отображает сообщение, если выбран неверный тип карты', () => {
    const form = createForm({ paymentMethodId: 'payment-method-invalidtype' });
    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.InvalidCardType
    );
  });

  it('возвращает false и отображает сообщение, если отсутствует шаблон для корректного типа карты', () => {
    // Сохраняем оригинальный шаблон
    const originalVisaPattern =
      cardPatterns['visa' as keyof typeof cardPatterns];

    // Временно удаляем шаблон Visa
    delete cardPatterns['visa' as keyof typeof cardPatterns];

    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '4111 1111 1111 1111',
    });
    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.InvalidCardType
    );

    // Восстанавливаем оригинальный шаблон
    cardPatterns['visa' as keyof typeof cardPatterns] = originalVisaPattern;
  });

  it('возвращает false и отображает сообщение, если поле номера карты не найдено', () => {
    const form = createForm({ paymentMethodId: 'payment-method-visa' });
    // Удаляем поле номера карты, если оно есть (в данном случае не добавлено)
    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.CardNumberFieldNotFound
    );
  });

  it('возвращает false и отображает сообщение, если номер карты пустой', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '   ',
    });
    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.InvalidCardNumber
    );
  });

  it('возвращает false и отображает сообщение, если номер карты не соответствует шаблону', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '1234567890123',
    });

    // Мокаем isValidLuhn как true для изоляции теста шаблона
    (isValidLuhn as jest.Mock).mockReturnValue(true);

    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.InvalidCardNumberFormat
    );
  });

  it('возвращает false и отображает сообщение, если номер карты не проходит проверку Луна', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '4111111111111111',
    });

    // Мокаем isValidLuhn как false для симуляции ошибки Луна
    (isValidLuhn as jest.Mock).mockReturnValue(false);

    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
    expect(displayMessage).toHaveBeenCalledWith(
      undefined,
      EValidateMessageText.InvalidCardNumberFormat
    );
  });

  it('возвращает true и отображает сообщение об успехе, если номер карты корректный', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '4111 1111 1111 1111',
    });

    // Мокаем isValidLuhn как true для симуляции корректной карты
    (isValidLuhn as jest.Mock).mockReturnValue(true);

    const messageBlock = document.createElement('div');
    const isValid = validateCreditCard(form, messageBlock);

    expect(isValid).toBe(true);
    expect(displayMessage).toHaveBeenCalledWith(
      messageBlock,
      EValidateMessageText.CorrectCardNumber,
      false
    );
  });

  it('должен подтвердить, что номер карты принадлежит платёжной системе Visa', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '4111 1111 1111 1111',
    });

    (isValidLuhn as jest.Mock).mockReturnValue(true);

    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(true);
  });

  it('должен аннулировать номер карты, который не принадлежит платёжной системе Visa', () => {
    const form = createForm({
      paymentMethodId: 'payment-method-visa',
      cardNumberValue: '5111 1111 1111 1111', // Mastercard префикс, не Visa
    });

    (isValidLuhn as jest.Mock).mockReturnValue(true);

    const isValid = validateCreditCard(form, undefined);

    expect(isValid).toBe(false);
  });
});
