export interface FieldConfig {
    name: string;
    type: 'text' | 'password' | 'email' | 'textarea';
    translationKey: string;
    validators?: any[];
}

export interface FormConfig {
    fields: FieldConfig[];
    submitButtonKey: string;
}   