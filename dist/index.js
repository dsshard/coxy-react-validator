var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Validator: () => Validator,
  ValidatorField: () => ValidatorField,
  ValidatorWrapper: () => ValidatorWrapper,
  rules: () => rules,
  useValidator: () => useValidator
});
module.exports = __toCommonJS(index_exports);

// src/rules.ts
var import_zod = require("zod");
var rules = {
  notEmpty: [import_zod.z.string().min(1, { error: "Field is required" })],
  isTrue: [import_zod.z.boolean({ error: "Value is required" }).and(import_zod.z.literal(true))],
  email: [import_zod.z.string().min(1, { error: "Email is required" }), import_zod.z.email({ message: "Email is invalid" })]
};

// src/validator.ts
var Field = class {
  rules;
  required;
  value;
  id;
  constructor({ rules: rules2, required, value, id }) {
    this.rules = rules2;
    this.required = required;
    this.value = value;
    this.id = id;
  }
  validate() {
    let isValid = true;
    let message = "";
    const { value, required, id } = this;
    let result = { success: true, data: value };
    const isEmptyValue = !value && Number.parseFloat(value) !== 0;
    const rules2 = Array.isArray(this.rules) ? this.rules : [this.rules];
    if (!rules2.length || isEmptyValue && required === false) {
      return {
        isValid,
        message,
        id,
        result: { success: true, data: value }
      };
    }
    for (const ruleItem of rules2) {
      if (isValid && ruleItem && "safeParse" in ruleItem) {
        result = ruleItem.safeParse(value);
        isValid = result.success;
        if (!isValid && result.error) {
          message = result.error.issues[0]?.message || "Validation error";
        }
      }
    }
    return { isValid, message, id, result };
  }
};
var Validator = class {
  fields;
  params;
  constructor(params) {
    this.params = params || null;
    this.fields = [];
  }
  addField(params) {
    const field = new Field(params);
    this.fields.push(field);
    return field;
  }
  removeField(field) {
    const index = this.fields.indexOf(field);
    if (index > -1) this.fields.splice(index, 1);
  }
  getField(id) {
    return this.fields.find((field) => field.id === id) || null;
  }
  validate() {
    let prevResult;
    const statuses = this.fields.map((field) => {
      if (this.params?.stopAtFirstError && prevResult && prevResult.isValid === false) {
        return null;
      }
      prevResult = field.validate();
      return prevResult;
    });
    const results = statuses.filter((inst) => inst && inst.isValid === false);
    if (results.length) {
      return results[0];
    }
    return { isValid: true, message: "", result: results[0]?.result };
  }
};

// src/use-validator.ts
function useValidator(value, rules2) {
  const validator = new Validator();
  validator.addField({ value, rules: rules2 });
  const { isValid, ...validateObject } = validator.validate();
  return [isValid, validateObject];
}

// src/validator-field.tsx
var import_react2 = require("react");

// src/context.ts
var import_react = require("react");
var Context = (0, import_react.createContext)(null);

// src/validator-field.tsx
var ValidatorField = (0, import_react2.forwardRef)(function ValidatorField2(props, _ref) {
  const { children, value } = props;
  const { registerField, unregisterField } = (0, import_react2.useContext)(Context);
  const propsRef = (0, import_react2.useRef)(props);
  propsRef.current = props;
  const handleRef = (0, import_react2.useRef)(null);
  if (!handleRef.current) {
    handleRef.current = {
      get props() {
        return propsRef.current;
      },
      validate: () => {
        const curr = propsRef.current;
        const field = new Field({
          rules: curr.rules,
          required: curr.required,
          value: curr.value,
          id: curr.id
        });
        return field.validate();
      }
    };
  }
  (0, import_react2.useEffect)(() => {
    registerField(handleRef.current);
    return () => {
      unregisterField(handleRef.current);
    };
  }, [registerField, unregisterField]);
  const validity = handleRef.current.validate();
  return typeof children === "function" ? children(validity, value) : children;
});

// src/validator-wrapper.tsx
var import_react3 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var ValidatorWrapper = (0, import_react3.forwardRef)(function ValidatorWrapper2({ children, stopAtFirstError }, ref) {
  const fieldsRef = (0, import_react3.useRef)([]);
  const registerField = (0, import_react3.useCallback)((field) => {
    if (field && !fieldsRef.current.includes(field)) {
      fieldsRef.current.push(field);
    }
  }, []);
  const unregisterField = (0, import_react3.useCallback)((field) => {
    const index = fieldsRef.current.indexOf(field);
    if (index > -1) fieldsRef.current.splice(index, 1);
  }, []);
  const getField = (0, import_react3.useCallback)((id) => {
    return fieldsRef.current.find((field) => field?.props?.id === id) || null;
  }, []);
  const validate = (0, import_react3.useCallback)(() => {
    const validator = new Validator({ stopAtFirstError });
    for (const comp of fieldsRef.current) {
      validator.addField(comp.props);
    }
    return validator.validate();
  }, [stopAtFirstError]);
  (0, import_react3.useImperativeHandle)(
    ref,
    () => ({
      validate,
      getField,
      registerField,
      unregisterField
    }),
    [validate, getField, registerField, unregisterField]
  );
  const contextValue = (0, import_react3.useMemo)(() => ({ registerField, unregisterField }), [registerField, unregisterField]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, { value: contextValue, children });
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Validator,
  ValidatorField,
  ValidatorWrapper,
  rules,
  useValidator
});
