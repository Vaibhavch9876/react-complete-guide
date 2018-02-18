import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

class Auth extends Component {

    state = {
        controls: {
            email: { ...this.generateInput('input', {
                    id: "email",
                    name: "email",                    
                    label: "E-mail",
                    type:  "email",
                    placeholder: "Your e-mail..." 
                }),
                validation: {
                    required: {
                        value: true,
                        errorMsg: 'This field is required',
                        ok: false
                    }
                },
                valid: false
            },
            password: { ...this.generateInput('input', {
                    id: "password",
                    name: "password",                    
                    label: "Password",
                    type:  "password",
                    placeholder: "Your password..." 
                }),
                validation: {
                    required: {
                        value: true,
                        errorMsg: 'This field is required',
                        ok: false
                    },
                    minLength: {
                        value: 6,
                        errorMsg: 'At least 6 characters are required for this field',
                        ok: false
                    }
                },
                valid: false
            }
        }
    }

    validateInput = (value, rules, field) => {
        let validationArray = [];
        let requiredValidation = null;
        let minLengthValidation = null;
        let maxLengthValidation = null;

        if (rules) {
            if (rules.required) {                
                value.trim() !== '' ? 
                requiredValidation = {
                    required: {
                        ok: true
                    }
                    
                } :
                requiredValidation = {
                    required: {
                        ok: false
                    }                    
                }

                validationArray.push((value.trim() !== ''))
            }

            if (rules.minLength) {
                value.length >= rules.minLength.value ?
                minLengthValidation = {
                    minLength: {
                        ok: true
                    }
                } :
                minLengthValidation = {
                    minLength: {
                        ok: false
                    }
                }

                validationArray.push((value.length >= rules.minLength.value));
            }

            if (rules.maxLength) {
                value.length <= rules.maxLength.value ?
                maxLengthValidation = {
                    maxLength: {
                        ok: true
                    }
                } :
                maxLengthValidation = {
                    maxLength: {
                        ok: false
                    }
                }

                validationArray.push((value.length <= rules.maxLength.value));
            }
        } else {
            validationArray.push(true);
        }

        return { valid: validationArray.every(entry => entry), validation: { ...requiredValidation, ...minLengthValidation, ...maxLengthValidation } }
    }

    handleInput = (e, field) => {
        const updatedValue = e.target.value;
        const updatedState = { ...this.state };
        const updatedControls = { ...updatedState.controls };
        const updatedControl = { ...updatedControls[field] };
        let updatedControlValidation = { ...updatedControl.validation }

        updatedControl.value = updatedValue;

        console.log('Validate Input: ', this.validateInput(updatedValue, updatedControl.validation, field))

        const { valid, validation } = this.validateInput(updatedValue, updatedControl.validation, field);

        updatedControl.valid = valid;
        updatedControl.touched = true;
        updatedControlValidation = Object.keys(updatedControlValidation).reduce((acc, v) => {
            acc[v] = {
                value: updatedControlValidation[v].value,
                errorMsg: updatedControlValidation[v].errorMsg,
                ok: validation[v].ok
            }
            return acc;
        }, {})
        updatedControl.validation = updatedControlValidation;

        updatedControls[field] = updatedControl;
        
        this.setState({ controls: updatedControls });        
    }   

    generateInput(inputtype, config) {
        let value = '';
        if (inputtype === 'select') value = config.options[0].value;
        return { inputtype, config, value, touched: false };
    }

    render() {        
        const { controls } = this.state;

        console.log('[Auth.js] Validation fields: ', Object.keys(this.state.controls).map(v => this.state.controls[v].validation))
        return (
            <div>
                <form action="">
                    { Object.keys(controls).map(field => (
                        <Input
                        key = { controls[field].config.id }
                        { ...controls[field] }
                        changed = { e => this.handleInput(e, field) }
                        shouldValidate = { controls[field].validation }

                        error = { 
                            Object
                            .keys(controls[field].validation)
                            .map((v, i) => {
                                return {
                                    key: i,
                                    errorMsg: controls[field].validation[v].errorMsg,
                                    ok: controls[field].validation[v].ok
                                }
                            }) }
                        />
                    )) }
                </form>
            </div>
        )
    }
}

export default Auth;