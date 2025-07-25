/**
 * Интерфейс класса создания HTML формы для проверки номера карты.
 *
 * @interface
 * @see CreditCardFormCreator
 */
export interface ICreditCardFormCreator {
  render: () => void;
}
