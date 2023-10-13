let formula = "";
let mathValues = [""];
let mathValuesIndex = 0;
let operators = [""];
let operatorsIndex = 0;
let length = 0;

function read(event) {
    length = formula.length;
    let trigger = event.srcElement.innerHTML;
    formula = document.querySelector('#display').value;

    if (trigger == "C") {
        formula = "";
        mathValues = [""];
        mathValuesIndex = 0;
        operators = [""];
        operatorsIndex = 0;
    }     
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
    else if (trigger == "+/-") {
        let closed = false;
        for (let i = length - 1; i >= 0; i--) {
            let code = formula[i].charCodeAt(0);

            if (i == 0 && formula[i] != "-") {
                if (formula[i] == "+")
                    formula = "-" + formula.slice(i+1)
                else if (formula[i] == "(" && closed == false)
                    formula = "-" + formula.slice(i + 1);
                else
                    formula = "-" + formula;
            }
            else if (!(code >= 48 && code <= 57)) {
                if (formula[i] == ")" && i != (length - 1)) {
                    formula = formula.slice(0, (i + 1)) + "-" + formula.slice(i + 1);
                    closed = true;
                }  
                else if (formula[i] == ")" && i == (length - 1)) {
                    closed = true;
                    continue;
                }

                else if (formula[i] == "(" && closed == false && i != (length - 1)) 
                    formula = formula.slice(0, (i + 1)) + "-" + formula.slice(i + 1);
                else if (formula[i] == "(" && closed == false && i == (length - 1)) 
                    formula = formula + "-";
                else if (formula[i] == "(" && closed == true) 
                    closed = false;
                
    
                else if (formula[i] == "-" && i != (length - 1) && closed == false) 
                    formula = formula.slice(0, i) + formula.slice(i + 1);
                else if (formula[i] == "-" && i == (length - 1) && closed == false) 
                    formula = formula.slice(0, i);

                else if (formula[i] == "+" && i != (length - 1) && closed == false) 
                    formula = formula.slice(0, i) + "-" + formula.slice(i + 1);
                else if (formula[i] == "+" && i == (length - 1) && closed == false) 
                    formula = formula.slice(0, i) + "-";
                else
                    continue;
                break;
            }  
        }
    }
    else if (trigger == "=") {
        parse();
        calculate();
    }
    else 
        formula = formula + trigger;
    document.querySelector('#display').value = formula;
}

// Parses the formula to be later solved.
function parse () {
    for (let i = 0; i < length; i++) {
        let buffer = formula[i];
        let code = buffer.charCodeAt(0);
        if ((code >= 48 && code <= 57)) 
            mathValues[mathValuesIndex] = mathValues[mathValuesIndex] + buffer;
        else {
            if (buffer == "x" || buffer == "X" || buffer == "*")
                operators[operatorsIndex] = "*";
            else if (buffer == "+") 
                operators[operatorsIndex] = "+";
            else if (buffer == "-") 
                operators[operatorsIndex] = "-";
            else if (buffer == "/") 
                operators[operatorsIndex] = "/";
            else if (buffer == "%") 
                operators[operatorsIndex] = "%";
            else if (buffer == ".") 
                operators[operatorsIndex] = ".";
            else if (buffer == "(") 
                operators[operatorsIndex] = ")";  
            else if (buffer == ")") 
                operators[operatorsIndex] = "("; 
            else {
                formula = "ERROR"
                mathValues = [""];
                mathValuesIndex = 0;
                operators = [""];
                operatorsIndex = 0;
                break;
            }
            operators.push("");
            operatorsIndexIndex++;
            mathValues.push("");
            mathValuesIndex++;
        } 
    }
}

// Calculates the formula based on parse
function calculate () {

}