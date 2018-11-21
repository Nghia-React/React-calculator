if(displayValue > 0 && value > 0){
    
    if(val1 === 1 || val2 === 1){

        console.log('Truong hop 1');

        if(computedVal % 1 === 0){

            console.log('1-1');

            this.setState({
                value: computedVal,
                displayValue: String(computedVal.toFixed())
            });
        } else{

            console.log('1-2');

            this.setState({
                value: computedVal,
                displayValue: String(computedVal.toFixed(val1 || val2))
            });
        }
        
    } else if(computedVal.countDecimals() >= 10){

        console.log('Truong hop 2');

        if(val1 > 1 || val2 > 1){
            this.setState({
                value: computedVal,
                displayValue: String(computedVal.toFixed(val1 || val2))
            });
        } else{
            this.setState({
                value: computedVal,
                displayValue: String(computedVal.toFixed(10))
            });
        }
        

    } else {
        
        console.log('Truong hop 3');

        this.setState({
            value: computedVal,
            displayValue: String(computedVal)
        });
    }

} else if(displayValue < 0 && value < 0 && operator === '/'){

    this.setState({
        displayValue: 'Math Error'
    });
}  