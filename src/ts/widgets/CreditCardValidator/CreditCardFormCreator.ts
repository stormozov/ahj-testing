import { validateCreditCard } from './CreditCardValidator';
import { ICreditCardFormCreator } from './types/interfaces';
import {
  CreditCardFormInput,
  CreditCardFormPaymentMethods,
  CreditCardFormSubmit,
  FormElementsConfig,
} from './types/types';

export default class CreditCardFormCreator implements ICreditCardFormCreator {
  /**
   * Имя класса формы.
   */
  private _formClassName = 'credit-card-form';

  /**
   * Объект с данными полей формы.
   */
  private _formElementsConfig: FormElementsConfig = {
    paymentMethods: {
      list: `${this._formClassName}__payment-method-list`,
      item: `${this._formClassName}__payment-method-item`,
    },
    input: {
      class: `${this._formClassName}__input`,
      placeholder: 'Напишите номер карты...',
    },
    submit: {
      class: `${this._formClassName}__submit`,
      text: 'Проверить номер карты',
    },
  };

  /**
   * Путь к иконкам методов оплаты.
   */
  private _paymentMethodIconsPath = './assets/icons/payment-method';

  constructor(
    private _container: HTMLDivElement,
    private _paymentMethodIcons: string[]
  ) {}

  /**
   * Отрисовывает форму.
   */
  render(): void {
    // Создаем элементы формы
    const form = this._createForm();
    const paymentMethodsList = this._createPaymentMethodList(
      this._formElementsConfig.paymentMethods
    );
    const inputWrapper = this._createCardInputWrapper();
    const input = this._createInput(this._formElementsConfig.input);
    const submit = this._createSubmitButton(this._formElementsConfig.submit);

    // Соединяем элементы формы
    form.append(paymentMethodsList);
    inputWrapper.append(input, submit);
    form.append(inputWrapper);

    // Добавляем форму в контейнер на HTML страницу
    this._container.append(form);

    // Инициализируем валидатор
    this._initValidator(form);
  }

  /**
   * Инициализирует валидатор для проверки номера карты.
   *
   * @param {HTMLFormElement} form Элемент формы.
   */
  private _initValidator(form: HTMLFormElement): void {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      validateCreditCard(form);
    });
  }

  /**
   * Создает HTML форму.
   *
   * @return {HTMLFormElement} Созданный элемент формы.
   */
  private _createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = this._formClassName;

    return form;
  }

  /**
   * Создает HTML список методов оплаты.
   *
   * Каждый метод — это одна radio-кнопка с иконкой.
   *
   * @param {CreditCardFormPaymentMethods} data Объект с данными полей списка методов оплаты.
   *
   * @return {void}
   */
  private _createPaymentMethodList(
    data: CreditCardFormPaymentMethods
  ): HTMLElement {
    const paymentMethodList = document.createElement('ul');
    paymentMethodList.className = data.list;

    this._paymentMethodIcons.forEach((iconFileName, index) => {
      const paymentMethodItem = document.createElement('li');
      paymentMethodItem.className = data.item;

      const paymentMethodName = iconFileName.replace('.svg', '');

      const radioInput = this._createRadioInput(paymentMethodName, index);
      const label = this._createLabel(
        paymentMethodName,
        iconFileName,
        radioInput.id
      );

      paymentMethodItem.append(radioInput);
      paymentMethodItem.append(label);

      paymentMethodList.append(paymentMethodItem);
    });

    return paymentMethodList;
  }

  /**
   * Создает HTML элемент radio-кнопки.
   *
   * @return {HTMLInputElement} Созданный элемент radio-кнопки.
   */
  private _createRadioInput(
    paymentMethodName: string,
    index: number
  ): HTMLInputElement {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'payment-method';
    radioInput.required = true;
    radioInput.id = `payment-method-${paymentMethodName.toLowerCase()}-${index}`;

    return radioInput;
  }

  /**
   * Создает HTML элемент label с иконкой.
   *
   * @return {HTMLLabelElement} Созданный элемент label.
   */
  private _createLabel(
    paymentMethodName: string,
    iconFileName: string,
    inputId: string
  ): HTMLLabelElement {
    const label = document.createElement('label');
    label.htmlFor = inputId;

    const img = document.createElement('img');
    img.src = `${this._paymentMethodIconsPath}/${iconFileName.toString()}`;
    img.alt = paymentMethodName;

    label.append(img);

    return label;
  }

  /**
   * Создает обертку для инпута ввода номера карты и кнопки.
   *
   * @return {HTMLDivElement} Созданный элемент обертки.
   */
  private _createCardInputWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = `${this._formClassName}__input-btn-wrapper`;

    return wrapper;
  }

  /**
   * Создает HTML инпут.
   *
   * @return {HTMLInputElement} Созданный элемент инпута.
   */
  private _createInput(data: CreditCardFormInput): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = data.class;
    input.placeholder = data.placeholder;
    input.required = true;

    return input;
  }

  /**
   * Создает HTML кнопку отправки формы.
   *
   * @return {HTMLButtonElement} Созданный элемент кнопки формы.
   */
  private _createSubmitButton(data: CreditCardFormSubmit): HTMLButtonElement {
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = data.class;
    submit.textContent = data.text;

    return submit;
  }
}
