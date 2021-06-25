export type OperationReturnType<T extends Object = object> = T & { status: number; message?: string; error?: string }
