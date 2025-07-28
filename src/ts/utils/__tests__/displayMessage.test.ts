import displayMessage from '../displayMessage';

describe('Функция displayMessage()', () => {
  let messageBlock: HTMLDivElement;

  beforeEach(() => {
    messageBlock = document.createElement('div');

    messageBlock.textContent = '';
    messageBlock.style.display = '';
    messageBlock.style.color = '';
  });

  it('по умолчанию устанавливает сообщение, отображение блока и красный цвет, если указан messageBlock', () => {
    displayMessage(messageBlock, 'Error message');

    expect(messageBlock.textContent).toBe('Error message');
    expect(messageBlock.style.display).toBe('block');
    expect(messageBlock.style.color).toBe('red');
  });

  it('устанавливает сообщение, блок отображения и зелёный цвет, если isError имеет значение false и указан messageBlock', () => {
    displayMessage(messageBlock, 'Success message', false);

    expect(messageBlock.textContent).toBe('Success message');
    expect(messageBlock.style.display).toBe('block');
    expect(messageBlock.style.color).toBe('green');
  });

  it('вызывает оповещение с сообщением, если messageBlock не определён', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    displayMessage(undefined, 'Alert message');
    expect(alertMock).toHaveBeenCalledWith('Alert message');

    alertMock.mockRestore();
  });
});
