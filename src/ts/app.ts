import CreditCardFormCreator from './widgets/CreditCardValidator/CreditCardFormCreator';

const initCreditCardValidator = (): void => {
  const creditCardForm = document.querySelector('.card-widget');
  /**
   * Массив иконок методов оплаты.
   */
  const paymentMethodIcons: string[] = [
    'Visa.svg',
    'Mastercard.svg',
    'Amex.svg',
    'Discover.svg',
    'JCB.svg',
    'DinersClub.svg',
    'Mir.svg',
  ];

  if (creditCardForm instanceof HTMLDivElement) {
    const formCreator = new CreditCardFormCreator(
      creditCardForm,
      paymentMethodIcons
    );

    formCreator.render();
  } else {
    console.error(
      'Element with class "card-widget" not found or is not a HTMLDivElement'
    );
  }
};

document.addEventListener('DOMContentLoaded', () => initCreditCardValidator());
