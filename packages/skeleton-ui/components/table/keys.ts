import type { InjectionKey } from '@spectacular/utils';
import type { DataHandler, Row } from '@vincjo/datatables';
type T = Row;

export const handlerKey: InjectionKey<DataHandler<T>> = Symbol('DataHandler type');
