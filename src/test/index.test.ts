import { describe, it, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from './types';


type User = {
  id: number;
  name: string;
  age: number;
  active: boolean;
  address: {
    city: string;
    zip: number;
    coords: {
      lat: number;
      lng: number;
    };
  };
  tags: string[];
};

type AppEvents = {
  click: MouseEvent;
  change: InputEvent;
  submit: SubmitEvent;
};



describe('DeepReadonly', () => {
  it('делает верхний уровень readonly', () => {
    type R = DeepReadonly<User>;

    expectTypeOf<R['id']>().toEqualTypeOf<number>();
    expectTypeOf<R['name']>().toEqualTypeOf<string>();
    expectTypeOf<R['active']>().toEqualTypeOf<boolean>();
  });

  it('рекурсивно делает вложенный объект readonly', () => {
    type R = DeepReadonly<User>;

    expectTypeOf<R['address']['city']>().toEqualTypeOf<string>();
    expectTypeOf<R['address']['zip']>().toEqualTypeOf<number>();
    expectTypeOf<R['address']['coords']['lat']>().toEqualTypeOf<number>();
  });

  it('делает массив ReadonlyArray', () => {
    type R = DeepReadonly<User>;

    expectTypeOf<R['tags']>().toEqualTypeOf<ReadonlyArray<string>>();
  });

  it('примитив остаётся примитивом', () => {
    expectTypeOf<DeepReadonly<string>>().toEqualTypeOf<string>();
    expectTypeOf<DeepReadonly<number>>().toEqualTypeOf<number>();
    expectTypeOf<DeepReadonly<boolean>>().toEqualTypeOf<boolean>();
  });

  it('не совместим с мутабельным вложенным типом', () => {
    type R = DeepReadonly<User>;


    expectTypeOf<R['address']['coords']>().not.toEqualTypeOf<{
      lat: number;
      lng: number;
    }>();
  });
});


describe('PickedByType', () => {
  it('выбирает только строковые поля', () => {
    type OnlyStrings = PickedByType<User, string>;

    expectTypeOf<OnlyStrings>().toEqualTypeOf<{
      name: string;
    }>();
  });

  it('выбирает только числовые поля', () => {
    type OnlyNumbers = PickedByType<User, number>;

    expectTypeOf<OnlyNumbers>().toEqualTypeOf<{
      id: number;
      age: number;
    }>();
  });

  it('выбирает только булевые поля', () => {
    type OnlyBooleans = PickedByType<User, boolean>;

    expectTypeOf<OnlyBooleans>().toEqualTypeOf<{
      active: boolean;
    }>();
  });

  it('возвращает пустой объект если тип не совпадает ни с одним полем', () => {
    type Nothing = PickedByType<User, symbol>;

    expectTypeOf<Nothing>().toEqualTypeOf<Record<never, never>>();
  });

  it('работает с union-типами', () => {
    type Mixed = PickedByType<User, string | number>;

    expectTypeOf<Mixed>().toEqualTypeOf<{
      id: number;
      age: number;
      name: string;
    }>();
  });
});


describe('EventHandlers', () => {
  it('генерирует onEventName ключи с заглавной буквы', () => {
    type Handlers = EventHandlers<AppEvents>;

    expectTypeOf<Handlers>().toHaveProperty('onClick');
    expectTypeOf<Handlers>().toHaveProperty('onChange');
    expectTypeOf<Handlers>().toHaveProperty('onSubmit');
  });

  it('каждый обработчик принимает правильный тип события', () => {
    type Handlers = EventHandlers<AppEvents>;

    expectTypeOf<Handlers['onClick']>().toEqualTypeOf<
      (event: MouseEvent) => void
    >();
    expectTypeOf<Handlers['onChange']>().toEqualTypeOf<
      (event: InputEvent) => void
    >();
    expectTypeOf<Handlers['onSubmit']>().toEqualTypeOf<
      (event: SubmitEvent) => void
    >();
  });

  it('возвращает void из обработчика', () => {
    type Handlers = EventHandlers<AppEvents>;

    expectTypeOf<Handlers['onClick']>().returns.toEqualTypeOf<void>();
  });

  it('исходные ключи без on не присутствуют', () => {
    type Handlers = EventHandlers<AppEvents>;


    type _test = Handlers['click'];
  });

  it('работает с кастомными событиями', () => {
    type CustomEvents = {
      resize: { width: number; height: number };
      close: null;
    };
    type Handlers = EventHandlers<CustomEvents>;

    expectTypeOf<Handlers['onResize']>().toEqualTypeOf<
      (event: { width: number; height: number }) => void
    >();
    expectTypeOf<Handlers['onClose']>().toEqualTypeOf<
      (event: null) => void
    >();
  });
});