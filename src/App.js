import React, { Component } from 'react';

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            value: null,
            displayValue: '0',
            detail: '',
            waitingForOperand: false,
            operator: null
        };

        this.onClear = this.onClear.bind(this);
        this.inputDot = this.inputDot.bind(this);
        this.toggleSign = this.toggleSign.bind(this);
        this.inputPercent = this.inputPercent.bind(this);
        this.squareRoot = this.squareRoot.bind(this);
        this.square = this.square.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    inputDigit(digit){
        const { displayValue, waitingForOperand } = this.state;

        if(waitingForOperand){
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false
            });
        } else{
            this.setState({
                displayValue: displayValue === '0' ? String(digit) : displayValue + digit
            });
        }
        
    }

    inputDot(){
        const { displayValue, waitingForOperand } = this.state;

        if(waitingForOperand){
            this.setState({
                displayValue: 0 + '.',
                waitingForOperand: false
            });
        }

        if(displayValue.indexOf('.') === -1){
            this.setState({
                displayValue: displayValue + '.',
                waitingForOperand: false
            });
        }
        
    }

    onClear(){
        this.setState({
            value: null,
            displayValue: '0',
            operator: null,
            waitingForOperand: false,
            detail: ''
        });
    }

    toggleSign(){
        const { displayValue } = this.state;
        
        if(displayValue != '0'){
            this.setState({
                displayValue: displayValue.charAt(0) === '-' ? displayValue.substr(1): '-' + displayValue
            });
        } 
    }

    inputPercent(){
        const { displayValue, waitingForOperand } = this.state;
        const value = parseFloat(displayValue);

        this.setState({
            displayValue: String(value/100),
            waitingForOperand: true
        });
    }

    squareRoot(){
        const { displayValue, waitingForOperand, operator } = this.state;
        const value = Math.sqrt(displayValue);

        if(displayValue === '0'){
            this.setState({
                displayValue: value,
                waitingForOperand: true
            });
        } 
        else if(displayValue < 0){
            alert('Input must > 0');
            this.setState({
                displayValue: 'Math Error',
                waitingForOperand: true
            });
        }
        else if(value % 1 !== 0){    //Khai can ko het          
            this.setState({
                displayValue: value.toFixed(10),
                waitingForOperand: true
            });
        } 
        else if(value % 1 === 0){    //Khai can het
            this.setState({
                displayValue: value,
                waitingForOperand: true
            });
        }

        if(operator !== '='){
            this.setState({
                detail: '\u221A' + displayValue
            });
        }   
    }

    square(){
        const { displayValue, waitingForOperand, operator } = this.state;
        const value = Math.pow(displayValue, 2);

        if(value % 1 !== 0){
            this.setState({
                displayValue: value.toFixed(2),
                waitingForOperand: true
            });
        } else{
            this.setState({
                displayValue: value,
                waitingForOperand: true
            });
        }
        
        if(operator !== '='){
            this.setState({
                detail: '(' + displayValue + ')^2'
            });
        }   
    }

    onBack(){
        const { displayValue } = this.state;

        if(displayValue.length < 2){
            this.setState({
                displayValue: '0'
            });
        } else{
            this.setState({
                displayValue: displayValue.substr(0, displayValue.length - 1)
            });
        }
    }

   
            
    calculate(nextOperator){
        const { displayValue, operator, value, detail, waitingForOperand } = this.state;
        const nextVal = parseFloat(displayValue);

        const operations = {
            '/': (prevVal, nextVal) => prevVal / nextVal,
            '*': (prevVal, nextVal) => prevVal * nextVal,
            '-': (prevVal, nextVal) => prevVal - nextVal,
            '+': (prevVal, nextVal) => prevVal + nextVal,
            '=': (prevVal, nextVal) => nextVal
        };


        //Count numbers after .
        Number.prototype.countDecimals = function () {
            if(Math.floor(this.valueOf()) === this.valueOf()) return 0; 
            else return this.toString().split(".")[1].length || 0; 
        };

        if(value === null){
            this.setState({
                value: nextVal
            });
        } else if(operator){
            const currentVal = value || 0;
            const computedVal = operations[operator](currentVal, nextVal);

            //console.log(computedVal);

            let val1 = value.countDecimals();
            let val2 = (parseFloat(displayValue)).countDecimals();

    
            if(displayValue !== 0 && value !== 0){
                
                if(operator === '/' && computedVal.countDecimals() >= 10){

                    console.log('Truong hop 1');

                    this.setState({
                        value: computedVal,
                        displayValue: String(computedVal.toFixed(10))
                    });
                } else if(operator === '*' && computedVal.countDecimals() >= 10){

                    console.log('Truong hop 2');

                    if(value.countDecimals() >= 8){
                        console.log('y');
                        this.setState({
                            value: computedVal,
                            displayValue: String(computedVal.toFixed())
                        });
                    } else{
                        this.setState({
                            value: computedVal,
                            displayValue: String(computedVal.toFixed(val1 || val2))
                        });
                    }
                    

                } 
                
                else{

                   
                    this.setState({
                        value: computedVal,
                        displayValue: String(computedVal)
                    });
                    
                    
                }
            } 
            
            // if(typeof(displayValue) !== 'number'){
            //     this.setState({
            //         displayValue: 'Math Error'
            //     });
            // }

            if(operator !== '='){
                this.setState({
                    detail: value + operator + displayValue,
                });
            }   
            
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator
        });

        
    }

    componentDidUpdate(prevProps, prevState) {
        let { displayValue } = this.state;
        if(displayValue === 'Infinity'){
            this.setState({
                displayValue: 'Math Error'
            });
        } else if(displayValue === 'NaN'){
            this.setState({
                displayValue: '0'
            });
        } 
    }

    render() {
       
        return (
            <div>
                <h1>React Calculator App</h1>
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                <div className="calculator">
                    <div className="result">
                        <div className="detail">{this.state.detail}</div>
                        {this.state.displayValue}
                    </div>
                    <div className="keypad">

                        <div className="function-keys">
                            <button className="key clear" onClick={this.onClear}>AC</button>
                            <button className="key toggle" onClick={this.toggleSign}>&plusmn;</button>
                            <button className="key percent" onClick={this.inputPercent}>%</button>

                            <button className="key del" onClick={this.onBack}>&#x2190;</button>
                            <button className="key sqrt" onClick={this.squareRoot}>&#8730;</button>
                            <button className="key pow" onClick={this.square}>x&#178;</button>
                        </div>

                        <div className="digit-keys">
                            <button className="key" onClick={() => this.inputDigit(7)}>7</button>
                            <button className="key" onClick={() => this.inputDigit(8)}>8</button>
                            <button className="key" onClick={() => this.inputDigit(9)}>9</button>
                            <button className="key" onClick={() => this.inputDigit(4)}>4</button>
                            <button className="key" onClick={() => this.inputDigit(5)}>5</button>
                            <button className="key" onClick={() => this.inputDigit(6)}>6</button>
                            <button className="key" onClick={() => this.inputDigit(1)}>1</button>
                            <button className="key" onClick={() => this.inputDigit(2)}>2</button>
                            <button className="key" onClick={() => this.inputDigit(3)}>3</button>
                            <button className="key" onClick={() => this.inputDigit(0)}>0</button>
                            <button className="key" onClick={this.inputDot}>.</button>
                        </div>

                        <div className="operator-keys">
                            <button className="key add" onClick={() => this.calculate('+')}>&#x002B;</button>
                            <button className="key subtract" onClick={() => this.calculate('-')}>&minus;</button>
                            <button className="key multiply" onClick={() => this.calculate('*')}>&times;</button>
                            <button className="key divide" onClick={() => this.calculate('/')}>&divide;</button>
                            <button className="key equal" onClick={() => this.calculate('=')}>=</button>
                        </div>             

                    </div>      
                </div>
            </div>
            

        );
    }
}


export default App;
