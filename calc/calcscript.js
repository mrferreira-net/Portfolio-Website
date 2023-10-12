let formula = "";

function read(event) {
    let trigger = event.srcElement.innerHTML;
    if (trigger == "C")
        formula = "";
    else if (trigger == "( )") {
        let length = formula.length;
        let sumLeft = 0;
        let sumRight = 0;

        for (let i = 0; i < length; i++) {
            if (formula[i] == "(")
                sumLeft++;
            else if (formula[i] == ")")
                sumRight++;    
        }
        
        if ((sumLeft - sumRight) == 1)
            formula = formula + ")";
        else
            formula = formula + "(";
    }
    else if (trigger == "=") {
        let length = formula.length;
        let mathValue = 0;

        for (let i = 0; i < length; i++) {
            if (isNaN(parseInt(formula[i]))) {

            }
            else
                mathValue = parseInt(formula[i]);
        }
    }
    else 
        formula = formula + trigger;
    document.querySelector('#display').value = formula;
}