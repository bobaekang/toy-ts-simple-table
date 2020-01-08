// https://spin.atomicobject.com/2018/11/05/using-an-int-type-in-typescript/
export type Int = number & { __int__: void }

export const toInt = (value: any): Int => Number.parseInt(value) as Int
