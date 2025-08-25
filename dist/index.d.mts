import * as react from 'react';
import { ReactNode } from 'react';

type Value = any;
type Fn$1 = (validity: Validity, value: Value) => ReactNode;
declare const ValidatorField: react.ForwardRefExoticComponent<FieldParams & {
    children?: ReactNode | Fn$1;
} & react.RefAttributes<unknown>>;

type Fn = (value: Value) => string;
interface ValidatorRule {
    rule: (value: Value) => boolean;
    message: string | Fn;
}
interface ErrorMessage {
    message: string;
    isValid: boolean;
}
interface Validity {
    message: string;
    isValid: boolean;
    errors?: ErrorMessage[];
    id?: string | number;
}
interface FieldParams {
    value: Value;
    rules: ValidatorRules;
    required?: boolean;
    id?: string | number;
}

type ValidatorRules = ValidatorRule[];
declare const rules: {
    notEmpty: {
        rule: (value: any) => boolean;
        message: string;
    }[];
    bool: {
        rule: (value: any) => boolean;
        message: string;
    }[];
    password: {
        rule: (value: any) => boolean;
        message: string;
    }[];
    email: {
        rule: (value: any) => boolean;
        message: string;
    }[];
    min: (min: any) => {
        rule: (value: any) => boolean;
        message: string;
    }[];
    max: (max: any) => {
        rule: (value: any) => boolean;
        message: string;
    }[];
    length: (min: any, max?: any) => {
        rule: (value: any) => boolean;
        message: string;
    }[];
};

declare function useValidator(value: Value, rules: ValidatorRules): [boolean, Pick<Validity, 'message' | 'errors'>];

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
    setCustomError: (customError: Validity) => void;
    clearCustomErrors: () => void;
}
declare const ValidatorWrapper: react.ForwardRefExoticComponent<ComponentProps & react.RefAttributes<ValidatorWrapper>>;

export { type ErrorMessage, type FieldParams, Validator, ValidatorField, type ValidatorRule, ValidatorWrapper, type Validity, rules, useValidator };
