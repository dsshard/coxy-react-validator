import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, Component, RefObject } from 'react';

type Value = any;
type Fn$1 = (validity: Validity, value: Value) => ReactNode;
interface Props {
    rules?: ValidatorRules;
    required?: boolean;
    value?: Value;
    id?: string | number;
    children?: ReactNode | Fn$1;
    unregisterField: (val: Value) => void;
    registerField: (val: Value) => void;
    customErrors: Array<Validity>;
}
declare function ValidatorField(props: Omit<Props, 'registerField' | 'unregisterField' | 'customErrors'>): react_jsx_runtime.JSX.Element;

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

declare class Field {
    private rules;
    private required;
    private value;
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

interface ComponentProps {
    children?: ReactNode;
    stopAtFirstError?: boolean;
    ref?: RefObject<ValidatorWrapper>;
}
declare class ValidatorWrapper extends Component<ComponentProps> {
    fields: any[];
    state: {
        customErrors: any[];
    };
    constructor(props: any);
    componentWillUnmount(): void;
    registerField(field: any): void;
    unregisterField(field: any): void;
    getField(id: any): Field | null;
    setCustomError(customError: Validity): void;
    clearCustomErrors(): void;
    validate(): Validity;
    render(): ReactNode;
}

declare function useValidator(value: Value, rules: ValidatorRules): [boolean, Pick<Validity, 'message' | 'errors'>];

export { type ErrorMessage, type FieldParams, Validator, ValidatorField, type ValidatorRule, ValidatorWrapper, type Validity, rules, useValidator };
