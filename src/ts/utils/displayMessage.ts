/**
 * Вспомогательная функция для отображения сообщения.
 *
 * @param {HTMLDivElement | undefined} messageBlock - Элемент для отображения сообщения.
 * @param {string} message - Сообщение для отображения.
 * @param {boolean} isError - Является ли сообщение об ошибке.
 */
export default function displayMessage(
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
