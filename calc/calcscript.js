let formula = "";
let parsedFormula = [""];
let parsedFormulaIndex = 0;
let length = 0;
let lastId = -1;

function read(event) {
    let trigger = event.srcElement.innerHTML;
    formula = document.querySelector('input').value;

    if (trigger == "C") 
        reset(); 
    else if (trigger == "⌫") 
        formula = formula.slice(0, (length - 1));
    else if (trigger == "+/-") {
        if (length == 0)
            formula = "(-";
        else {
            for (let i = length - 1; i >= 0; i--) {
                if (typeId(formula[i]) == 1 && i > 0) 
                    continue;
                else if (typeId(formula[i]) == 1)
                    formula = "(-" + formula;
                else if (i == (length - 1)){
                    if (formula[i] == ")") 
                        formula = formula + "x(-";
                    else if (formula[i] == "-" && i > 0) {
                        if (formula[i - 1] == "(")
                            formula = formula.slice(0, (i - 1));
                        else
                            formula = formula + "(-";
                    }
                    else
                        formula = formula + "(-";
                }
                else if (formula[i] == "-" && i > 0) {
                    if (formula[i - 1] == "(")
                        formula = formula.slice(0, (i - 1)) + formula.slice(i + 1);
                    else
                        formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                }
                else
                    formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                break;
            }
        }
    }
    else if (trigger == "=") {
        parse();
        calculate();
    }
    else if (trigger == "( )") {
        let sumLeft = 0;
        let sumRight = 0;

        for (let i = 0; i < length; i++) {
            if (formula[i] == "(")
                sumLeft++;
            else if (formula[i] == ")")
                sumRight++;    
        }

        if (length == 0) 
            formula = "(";
        else if (lastId != 0 && sumLeft == sumRight)
            formula = formula + "x(";
        else if (lastId == 0 && sumLeft == sumRight)
            formula = formula + "(";
        else if (lastId == 1)
            formula = formula + ")";
        else if (lastId == -1) {
            if (formula[length - 1] == ")")
                formula = formula + ")";
            else
                formula = formula + "(";
        }
        else if (lastId == 0) {
            formula = formula + "(";
        }  
    }
    else if (trigger == "%") {
        if (length != 0 && lastId != 0 && formula[length - 1] != "%" && formula[length - 1] != "(")
            formula = formula + "%";
    }
    else if (trigger == ".") {
        if (lastId == 1) {
            for (let i = length - 1; i >= 0; i--) {
                if (formula[i] == ".")
                    break;
                else if (typeId(formula[i]) == 1 && i == 0)
                    formula = formula + ".";
                else if (typeId(formula[i]) == 1)
                    continue;
                else {
                    formula = formula + ".";
                    break;
                }
            }
        }
        else if (formula[length - 1] == ")")
            formula = formula + "x0.";
        else if (formula[length - 1] != ".")
            formula = formula + "0.";
    }
    else if (typeId(trigger) == 0) {
        if (lastId == -1 && formula[length - 1] != ")") {
            formula = formula;
            if (lastId == -1 && length > 0 && (trigger == "+" || trigger == "-"))
                formula = formula + trigger;
        }
        else if (lastId == 0 && typeId(trigger) == 0) {
            if ((trigger == "+" || trigger == "-") && formula[length - 2] == "(")
                formula = formula.slice(0, (length - 1)) + trigger;
            else if ((trigger == "/" || trigger == "x") && formula[length - 2] == "(")
                formula = formula.slice(0, (length - 1));
            else
            formula = formula.slice(0, (length - 1)) + trigger;
        }
        else 
            formula = formula + trigger
    }
    else 
        formula = formula + trigger;
    
    length = formula.length;
    lastId = typeId(formula[length - 1]);
    document.querySelector('input').value = formula;
}

//-------------------------------NON-MAIN FUNCTIONS-------------------------------

// Parses the formula to be later solved.
function parse () {
    for (let i = 0; i < length; i++) {
        let buffer = formula[i];
        if (typeId(buffer) == 1) 
            parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + buffer;
        else {
            parsedFormula.push("");
            parsedFormulaIndex++;
            if (buffer == "x")
                parsedFormula[parsedFormulaIndex] = "*";
            else if (buffer == "+") 
                parsedFormula[parsedFormulaIndex] = "+";
            else if (buffer == "-") 
                parsedFoparsedFormula[parsedFormulaIndex] = "-";
            else if (buffer == "/") 
                parsedFoparsedFormula[parsedFormulaIndex] = "/";
            else if (buffer == "%") {
                parsedFoparsedFormula[parsedFormulaIndex] = "/";
                parsedFormula.push("");
                parsedFormulaIndex++;
                parsedFoparsedFormula[parsedFormulaIndex] = "100";
            }   
            else if (buffer == ".") 
                parsedFoparsedFormula[parsedFormulaIndex] = ".";
            else if (buffer == "(") 
                parsedFoparsedFormula[parsedFormulaIndex] = ")";  
            else if (buffer == ")") 
                parsedFoparsedFormula[parsedFormulaIndex] = "("; 
            else {
                reset();
                break;
            }
            parsedFormula.push("");
            parsedFormulaIndex++;
        } 
    }
}

// Calculates the formula based on parse
function calculate () {
    
}

// Returns 0 if value is a mathematical operator 1 if it's a number and -1 if it's neither.
function typeId (value) {
    if (value != undefined){
        let code = value.charCodeAt(0);
        if (value.length > 1)
            return lastId;
        if ((code >= 48 && code <= 57) || value == "%" || value == ".")
            return 1;
        else {
            let operators = ["x", "+", "-", "/",]
            let operatorsLen = operators.length;
            for (let i = 0; i < operatorsLen; i++) {
                if (value == operators[i])
                    return 0;
            }
            return -1;
        }
    }
    else
        return lastId;
}

// Resets the calculator
function reset () {
    formula = "";
    parsedFormula = [""];
    parsedFormulaIndex = 0;
    length = 0;
    lastId = -1;
}