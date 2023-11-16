let formula = "";
let parsedFormula = [""];
let parsedFormulaIndex = 0;
let length = 0;

// trigger function that designates the formula set-up based on button input.
function read(event) {
    let trigger = event.srcElement.innerHTML;
    formula = document.querySelector('#display').value;
    length = formula.length;
    let lastId = -1;
    if (length > 0)
        lastId = typeId(formula[length - 1]);

    if (trigger == "C") 
        reset(); 
    else if (trigger == "⌫") {
        formula = formula.slice(0, (length - 1));
        fancy();
    }
        
    else if (trigger == "+/-") {
        if (length == 0)
            formula = "(-";
        else {
            for (let i = length - 1; i >= 0; i--) {
                if (typeId(formula[i]) == 1 && i > 0) {
                    if (formula[i] == "%") 
                        formula = formula + "x(-";
                    else
                        continue;
                }
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
        length = formula.length;
        if (length == 0 || formula == "ERROR")
            return;
        else if (parseFloat(formula) == 0) 
            formula = "";
        else {
            parse();
            formula = calculate(parsedFormula);
        }
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
            else if ((trigger == "÷" || trigger == "x") && formula[length - 2] == "(")
                formula = formula.slice(0, (length - 1));
            else
            formula = formula.slice(0, (length - 1)) + trigger;
        }
        else 
            formula = formula + trigger;
    }
    else if (typeId(trigger) == 1 && length > 1 && (formula[length - 1] == "%" || formula[length - 1] == ")"))
        formula = formula + "x" + trigger;
    else {
        let decInNum = false;
        for (let i = length - 1; i >= 0; i--) {
            if (typeId(formula[i]) == 0 && formula[i] != ".") 
                break;
            else if (formula[i] == ".") 
                decInNum = true;
        }

        if (trigger == "0" && decInNum == false && formula[length - 1] == "0")
            return;

        let digitCount = 0;
        let decDigitCount = 0;
        for (let i = length - 1; i >= 0; i--) {
            if (typeId(formula[i]) == 0 && formula[i] != ".") 
                break;
            else if (formula[i] == ".") {
                decDigitCount = digitCount;
                continue;
            }
            else if (formula[i] == ",")
                continue;
            digitCount++;
        }
        if (digitCount < 15 && decDigitCount < 10)
            formula = formula + trigger;
    }
    
    fancy();
    document.querySelector('#display').value = formula;
    reset();
}

//-------------------------------NON-MAIN FUNCTIONS-------------------------------

// Parses the formula to be later solved.
function parse () {
    for (let i = 0; i < length; i++) {
        if (typeId(formula[i]) == 1) 
            if (formula[i] == "%") {
                next();
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex - 1];
                parsedFormula[parsedFormulaIndex - 1] = "(";
                next();
                parsedFormula[parsedFormulaIndex] = "/";
                next();
                parsedFormula[parsedFormulaIndex] = "100";
                next();
                parsedFormula[parsedFormulaIndex] = ")";
            }
            else if (formula[i] == ",") 
                continue;
            else if (formula[i] == "e") {
                next();
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex - 1];
                parsedFormula[parsedFormulaIndex - 1] = "(";
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + "e" + formula[i + 1];
                i++;
            }
            else if ((typeId(parsedFormula[parsedFormulaIndex]) == 1))
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + formula[i];
            else {
                next();
                parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex] + formula[i];
            }
        else {
            next();
            if (formula[i] == "x" && i < (length - 1))
                parsedFormula[parsedFormulaIndex] = "*";
            else if (formula[i] == "+" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "+";
            else if (formula[i] == "-" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "-";
            else if (formula[i] == "÷" && i < (length - 1))
                parsedFormula[parsedFormulaIndex] = "/";
            else if (formula[i] == "(" && i < (length - 1)) 
                parsedFormula[parsedFormulaIndex] = "(";  
            else if (formula[i] == "(" && length > 1 && i == (length - 1)) {
                parsedFormula.pop();
            }
            else if (formula[i] == ")") 
                parsedFormula[parsedFormulaIndex] = ")"; 
        } 
    }
    let parsedFormulaLen = parsedFormula.length;
    for (let i = 0; i < parsedFormulaLen; i++) {
        parsedFormulaLen = parsedFormula.length;
        if (parsedFormula[i] == "/" && parsedFormula[i - 1] != ")" && parsedFormula[i + 1] != "(") {
            parsedFormula.splice((i - 1), 0, "(");
            if (i < (parsedFormulaLen - 2)) 
                parsedFormula.splice((i + 3), 0, ")");
            else 
                parsedFormula.push(")");
            i++; 
        }
    }
    let sumLeft = 0;
    let sumRight = 0;
    parsedFormulaLen = parsedFormula.length;
    for (let i = 0; i < parsedFormulaLen; i++) {
        if (parsedFormula[i] == "(")
            sumLeft++;
        else if (parsedFormula[i] == ")")
            sumRight++;    
    }
    while (sumLeft > sumRight) {
        parsedFormula.push(")");
        sumRight++;
    }
        
}

// Calculates the formula based on parsedFormula.
// Recall - PEMDAS.
function calculate (formula) {
    let formulaLen = formula.length;
    let calculation = 0;
    
    // Solve parentheses using recursion.
    let parenthesesSize = 0;
    for (let i = 0; i < formulaLen; i++) {
        if (formula[i] == "(") {
            let openCount = 1;
            let closedCount = 0;
            for (let j = i + 1; j < formulaLen; j++) {
                if (formula[j] == "(")
                    openCount++;
                else if (formula[j] == ")")
                    closedCount++;
                if (openCount == closedCount)  {
                    parenthesesSize = (j - i) + 1;
                    let localCalc = 0;
                    localCalc = calculate(formula.slice((i + 1), j));
                    if (localCalc == "ERROR")
                        return "ERROR";
                    formula.splice(i, parenthesesSize, localCalc);
                    formulaLen = formula.length;
                    break;
                }
            }
        }
    }

    // Solve multiplications and divisions.
    for (let i = 0; i < formulaLen; i++) {
        if ((formula[i] == "*" || formula[i] == "/") && i != (formulaLen - 1)) {
            let localCalc = 0;
            let num1 = parseFloat(formula[i - 1])
            let num2 = parseFloat(formula[i + 1])
            if (formula[i] == "*")
                localCalc = num1 * num2;
            else {
                if (num2 == 0)
                    return "ERROR";
                else
                    localCalc = num1 / num2;
            }
            localCalc = precision(localCalc.toString());
            formula.splice(i - 1, 3, localCalc);
            formulaLen = formula.length;
            i = i - 1;
        }
    }

    // Solve additions and subtractions.
    let sum = false;
    let sub = false;
    for (let i = 0; i < formulaLen; i++) {
        let num = parseFloat(formula[i]);
        if (!isNaN(num)) {
            if (sum || i == 0) {
                calculation = calculation + num;
                sum = false;
            }
            else if (sub) {
                calculation = calculation - num;
                sub = false;
            }
            calculation = parseFloat(precision(calculation.toString()));
        }
        else if (formula[i] == "+") 
            sum = true;
        else if (formula[i] == "-") 
            sub = true; 
    }
    return calculation.toString();
}

// Limits size of calculated numbers to 10 digits after the decimal,
// this is due to Javascript's floating point number innaccuracy.
function precision(num) {
    if (num == "0") {
        num = "";
        return num;
    }
    

    // Counts number of digits after the decimal
    let dec = false;
    let decDigitCount = 0;
    let tempNum = "";
    let decIndex = -1;
    for (let i = 0; i < num.length; i++) {
        if (num[i] == ".") {
            dec = true;
            decIndex = i;
            continue;
        }
        if (dec)
            decDigitCount++;
        if (decDigitCount == 11) {
            if ((i + 1) > (num.length - 1)) 
                tempNum = num;
            else
                tempNum = num.slice(0, i + 1);
            break;
        }
    }

    
    if (decDigitCount < 11) 
        return num;
    else if (parseInt(tempNum[tempNum.length - 1]) > 4) {
        let newVal = parseInt(tempNum.slice(decIndex + 1, (tempNum.length - 1))) + 1;
        newVal = newVal.toString();
        if (newVal.length == 11) {
            num = parseInt(tempNum.slice(0, decIndex)) + 1;
            num = num.toString();
        }
        else 
            num = tempNum.slice(0, decIndex) + "." + newVal;
    }
    else {
        num = parseFloat(tempNum.slice(0, (tempNum.length - 1)));
        num = num.toString();
    }
    return num;
}

// Returns 0 if value is a mathematical operator 1 if it's a number and -1 if it's neither.
function typeId (value) {
    if (value != undefined) {
        if (value == "+/-")
            return lastId;
        if (!isNaN(parseFloat(value)) || value == "%" || value == "." || value == "," || value == "e")
            return 1;
        else {
            let operators = ["x", "+", "-", "÷",]
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

// Adds commas for every 3 integer digits
function fancy () {
    length = formula.length;
    let nonFancy = ""
    let newNumStartIndex = -1;
    let decInNum = false;
    for (let i = 0; i < length; i++) {
        if (formula[i] != "," && decInNum == false)
            nonFancy = nonFancy + formula[i];
        if (formula[i] == ".") {
            decInNum = true;
            nonFancy = nonFancy.slice(0, (nonFancy.length - 1));
            newNumStartIndex = i;
        }
        if (formula[i] == "(") {
            nonFancy = "";
            newNumStartIndex = i;
        }
        if (typeId(formula[i]) == 0 || formula[i] == ")" || formula[i] == "%") {
            decInNum = false;
            nonFancy = "";
            newNumStartIndex = i;
        }
        
    }
    let nonFancyLen = nonFancy.length;

    if (nonFancyLen > 0 && nonFancy != "0" && formula != "ERROR") {
        let fancy = "";
        for (let i = nonFancyLen - 4; i >= 0; i = i - 3) {
            if (i == nonFancyLen - 4) 
                fancy = "," + nonFancy.slice(i + 1) + fancy;
            else
                fancy = "," + nonFancy.slice(i + 1, i + 4) + fancy;
        }
            
        if (nonFancyLen % 3 == 2) 
            fancy = nonFancy.slice(0, 2) + fancy;
        if (nonFancyLen % 3 == 1)
            fancy = nonFancy[0] + fancy;
        if (nonFancyLen % 3 == 0)
            fancy = nonFancy.slice(0, 3) + fancy;
        if (newNumStartIndex == -1) 
            formula = fancy;
        else if (decInNum)
            formula = fancy + "." + formula.slice(newNumStartIndex + 1);
        else
            formula = formula.slice(0, (newNumStartIndex + 1)) + fancy;
    }
}

// Resets the calculator
function reset () {
    formula = "";
    parsedFormula = [""];
    parsedFormulaIndex = 0;
    length = 0;
}

function next (){
    if (parsedFormula[parsedFormulaIndex] != "") {
        parsedFormula.push("");
        parsedFormulaIndex++;
    }
}