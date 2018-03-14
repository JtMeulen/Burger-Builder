import React from 'react';
import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    let errorMessage = null;

    const InputClasses = [classes.InputElement]
    if (!props.invalid && props.shouldValidate && props.touched){
        InputClasses.push(classes.Invalid);
        errorMessage = <p className={classes.ErrorMessage}>{props.elementConfig.error}</p>
    }
    
    
    switch (props.elementType) {
        case ('input'):
            inputElement = <input 
                            className={InputClasses.join(" ")} 
                            {...props.elementConfig} 
                            value={props.value}
                            onChange={props.changed} />
            break;
        case ('textarea'):
            inputElement = <textarea 
                            className={InputClasses.join(" ")} 
                            {...props.elementConfig} 
                            value={props.value}
                            onChange={props.changed} />
            break;
        case ('select'):
            inputElement = <select 
                            className={InputClasses.join(" ")} 
                            value={props.value}
                            onChange={props.changed} >
                                {props.elementConfig.options.map(option => (
                                    <option key={option.value} value={option.value}>{option.displayValue}</option>
                                ))} 
                            </select>
                            
            break;
        default:
            inputElement = <input 
                            className={InputClasses.join(" ")}                             
                            value={props.value}
                            {...props.elementConfig}
                            onChange={props.changed} />
            break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.elementConfig.label}</label>
            {inputElement}
            {errorMessage}
        </div>
    )
};

export default input;