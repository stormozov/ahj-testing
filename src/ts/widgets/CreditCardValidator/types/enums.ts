/**
 * Тип кредитной карты
 */
export enum ECardType {
  Visa = 'visa',
  Mastercard = 'mastercard',
  Amex = 'amex',
  Discover = 'discover',
  Mir = 'mir',
  DinersClub = 'dinersclub',
  Jcb = 'jcb',
}

/**
 * Текст сообщений результата работы валидатора
 */
export enum EValidateMessageText {
  CorrectCardNumber = 'Номер карты валиден',
  FormNotFound = 'Форма не найдена',
  InvalidCardNumber = 'Некорректный номер карты',
  InvalidCardType = 'Некорректный тип карты',
  PaymentMethodNotFound = 'Пожалуйста, выберите тип карты',
  CardNumberFieldNotFound = 'Поле для номера карты не найдено',
  InvalidCardNumberFormat = 'Неверный номер карты для выбранного типа карты',
}
