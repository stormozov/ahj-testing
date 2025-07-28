/**
 * Тип, описывающий конфигурацию элементов формы.
 *
 * @type {FormElementsConfig}
 */
export type FormElementsConfig = {
  paymentMethods: CreditCardFormPaymentMethods;
  input: CreditCardFormInput;
  submit: CreditCardFormSubmit;
  status: CreditCardFormStatus;
};

/**
 * Тип, описывающий элементы списка методов оплаты.
 *
 * @type {CreditCardFormPaymentMethods}
 */
export type CreditCardFormPaymentMethods = {
  list: string;
  item: string;
};

/**
 * Тип, описывающий элемент инпута.
 *
 * @type {CreditCardFormInput}
 */
export type CreditCardFormInput = {
  class: string;
  placeholder: string;
};

/**
 * Тип, описывающий элемент кнопки отправки формы.
 *
 * @type {CreditCardFormSubmit}
 */
export type CreditCardFormSubmit = {
  class: string;
  text: string;
};

/**
 * Тип, описывающий элемент статуса проверки номера карты.
 *
 * @type {CreditCardFormStatus}
 */
export type CreditCardFormStatus = {
  class: string;
};
