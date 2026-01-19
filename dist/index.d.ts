import { z } from 'zod';
import { ZodSafeParseResult } from 'zod/index';
import * as react from 'react';
import { ReactNode } from 'react';

type ValidatorRules = z.ZodType[] | z.ZodType;
declare const rules: {
    notEmpty: z.ZodString[];
    isTrue: z.ZodIntersection<z.ZodBoolean, z.ZodLiteral<true>>[];
    email: (z.ZodString | z.ZodEmail)[];
};

type Value = any;
type Fn = (validity: Validity, value: Value) => ReactNode;
declare const ValidatorField: react.ForwardRefExoticComponent<FieldParams & {
    children?: ReactNode | Fn;
} & react.RefAttributes<unknown>>;

interface ErrorMessage {
    message: string;
    isValid: boolean;
}
interface Validity {
    message: string;
    isValid: boolean;
    result: ZodSafeParseResult<unknown>;
    id?: string | number;
}
interface FieldParams {
    value: Value;
    rules: ValidatorRules;
    required?: boolean;
    id?: string | number;
}

declare function useValidator(value: Value, rules: ValidatorRules): [boolean, Pick<Validity, 'message'>];

declare class Field {
    protected rules: ValidatorRules;
    protected required: boolean;
    protected value: Value;
    id: string | number;
    constructor({ rules, required, value, id }: FieldParams);
    validate(): Validity;
}
interface ValidatorParams {
    stopAtFirstError: boolean;
}
declare class Validator {
    private fields;
    private params;
    constructor(params?: ValidatorParams);
    addField(params: FieldParams): Field;
    removeField(field: Field): void;
    getField(id: Field['id']): Field;
    validate(): Validity;
}

interface RegisteredFieldHandle {
    props: FieldParams;
    validate: () => Validity;
}

interface ComponentProps {
    children?: ReactNode;
    stopAtFirstError?: boolean;
}
interface ValidatorWrapper {
    validate: () => Validity;
    getField: (id: string | number) => RegisteredFieldHandle | null;
    registerField: (field: RegisteredFieldHandle) => void;
    unregisterField: (field: RegisteredFieldHandle) => void;
}
declare const ValidatorWrapper: react.ForwardRefExoticComponent<ComponentProps & react.RefAttributes<ValidatorWrapper>>;

export { type ErrorMessage, type FieldParams, Validator, ValidatorField, ValidatorWrapper, type Validity, rules, useValidator };
