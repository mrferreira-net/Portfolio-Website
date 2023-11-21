let formula = "0";
let parsedFormula = [""];
let parsedFormulaIndex = 0;
let length = 0;
let lastId = -1;

// trigger function that designates the formula set-up based on button input.
function read(event) {
    let trigger = event.srcElement.innerHTML;
    formula = document.querySelector('#display').value;
    length = formula.length;
    if (length > 0)
        lastId = typeId(formula[length - 1]);

    if (trigger == "C") 
        reset(); 
    else if (trigger == "⌫") {
        if (formula == "ERROR" || formula == "Infinity")
            reset();
        else {
            formula = formula.slice(0, (length - 1));
            fancy();
            if (formula == "") 
                reset();
        }
    }
    else if (formula == "ERROR" || formula == "Infinity") 
        return;
    else if (trigger == "=") {
        length = formula.length;
        parse();
        formula = calculate(parsedFormula);
    }
    else if (trigger == "+/-") {
        if (formula == "0")
            formula = "(-";
        else if (formula == "(-")
            formula = "0";
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
                    if (formula[i - 1] == "e")
                            continue;
                    else if (formula[i - 1] == "(")
                        formula = formula.slice(0, (i - 1)) + formula.slice(i + 1);
                    else
                        formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                }
                else {
                    if (i - 1 >= 0) {
                        if (formula[i - 1] == "e")
                            continue;
                    }
                    formula = formula.slice(0, (i + 1)) + "(-" + formula.slice(i + 1);
                } 
                break;
            }
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

        if (formula == "0") 
            formula = "(";
        else if (formula[length - 1] == "." && sumRight == sumLeft) 
            formula = formula.slice(0, length - 1) + "x(";
        else if (formula[length - 1] == "." && sumRight < sumLeft)
            formula = formula.slice(0, length - 1) + ")";
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
        if (formula[length - 1] == ".")
            formula = formula.slice(0, (length - 1)) + trigger;
        if (length != 0 && lastId != 0 && formula[length - 1] != "%" && formula[length - 1] != "(")
            formula = formula + "%";
    }
    else if (trigger == ".") {
        if (lastId == 1 && formula[length - 1] != "%") {
            for (let i = length - 1; i >= 0; i--) {
                if (formula[i] == ".")
                    break;
                else if (typeId(formula[i]) == 1 && i == 0)
                    formula = formula + ".";
                else if (typeId(formula[i]) == 1)
                    continue;
                else {
                    if (i > 0) {
                        if (formula[i - 1] == "e")
                            break;
                    }
                    formula = formula + ".";
                    break;
                }
            }
        }
        else if (formula[length - 1] == ")" || formula[length - 1] == "%")
            formula = formula + "x0.";
        else if (formula[length - 1] != ".")
            formula = formula + "0.";
    }
    else if (typeId(trigger) == 0) {
        if (formula[length - 1] == "(") {
            formula = formula;
            if (lastId == -1 && length > 0 && trigger == "-")
                formula = formula + trigger;
        }
        else if (lastId == 0) {
            if ((trigger == "+" || trigger == "-") && formula[length - 2] == "(") {
                if (trigger == "+" && formula[length - 1] == "-")
                    formula = formula.slice(0, (length - 1));
                else
                    formula = formula.slice(0, (length - 1)) + trigger;
            }
            else if ((trigger == "÷" || trigger == "x") && formula[length - 2] == "(")
                formula = formula.slice(0, (length - 1));
            else
                formula = formula.slice(0, (length - 1)) + trigger;
        }
        else {
            if (formula[length - 1] == ".")
                formula = formula.slice(0, length - 1) + trigger;
            else if (formula[length - 1] == "(" && trigger == "+")
                return;
            else
                formula = formula + trigger;
        } 
    }
    else if (typeId(trigger) == 1 && length > 1 && (formula[length - 1] == "%" || formula[length - 1] == ")"))
        formula = formula + "x" + trigger;
    else if (typeId(trigger) == 1){
        if (formula == "0" || formula == "ERROR")
            formula = trigger;
        else if (lastId == 0 && trigger == "0")
            formula = formula + trigger;
        else {
            let naturalNumOrDecimal = false;
            for (let i = length - 1; i >= 0; i--) {
                if (formula[i] == "." || parseInt(formula[i]) > 0){
                    naturalNumOrDecimal = true;
                    break;
                }
            }

            if (trigger == "0" && naturalNumOrDecimal == false && formula[length - 1] == "0")
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
            if (length > 1 && formula[length - 1] == "0" && typeId(formula[length - 2]) == 0 && trigger == "0")
                return;
            else if (length > 1 && formula[length - 1] == "0" && typeId(formula[length - 2]) == 0 && trigger != "0")
                formula = formula.slice(0, length - 1) + trigger;
            else if (digitCount < 15 && decDigitCount < 10)
                formula = formula + trigger;
        }
    }
    
    fancy();
    document.querySelector('#display').value = formula;
    lastId = typeId(formula[length - 1]);
    reset();
}

//-------------------------------NON-MAIN FUNCTIONS-------------------------------

// Parses the formula to be later solved.
function parse () {
    let parsedFormulaLen = parsedFormula.length;
    for (let i = 0; i < length; i++) {
        if (typeId(formula[i]) == 1) 
            if (formula[i] == "%") {
                if (parsedFormula[parsedFormulaIndex - 1] == ")") {
                    parsedFormulaLen = parsedFormula.length;
                    let closedCount = 0;
                    let openIndex = -1;
                    for (let j = parsedFormulaLen - 1; j >= 0; j--) {
                        if (parsedFormula[j] == ")")
                            closedCount++;
                        else if (parsedFormula[j] == "(" && closedCount == 1) 
                            openIndex = j;
                        else if (parsedFormula[j] == "(") 
                            closedCount--;
                    }
                    parsedFormula.splice(openIndex, 0, "(");
                    parsedFormulaIndex++;
                }
                else {
                    next();
                    parsedFormula[parsedFormulaIndex] = parsedFormula[parsedFormulaIndex - 1];
                    parsedFormula[parsedFormulaIndex - 1] = "(";
                    next();
                }
                parsedFormula[parsedFormulaIndex] = "/";
                next();
                parsedFormula[parsedFormulaIndex] = "100";
                next();
                parsedFormula[parsedFormulaIndex] = ")";
            }
            else if (formula[i] == ",") 
                continue;
            else if (formula[i] == "e") {
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
    parsedFormulaLen = parsedFormula.length;
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
    if (num == "0")
        return num;

    // Counts number of digits after the decimal
    let dec = false;
    let decDigitCount = 0;
    let nonZeroDecDigitCount = 0;
    let nonZeroIndex = -1;
    let tempNum = "";
    let decIndex = -1;
    let eIndex = -1;
    for (let i = 0; i < num.length; i++) {
        if (num[i] == ".") {
            dec = true;
            decIndex = i;
            continue;
        }
        if (num[i] == "e") {
            eIndex = i;
            if (dec == false)
                return num;
            dec = false;
        }
        if (dec) {
            decDigitCount++;
            if (num[i] != "0" && nonZeroIndex == -1) 
                nonZeroIndex = i;
            if (nonZeroIndex != -1 && eIndex == -1)
                nonZeroDecDigitCount++;  
        }
            
        if (decDigitCount == 11) {
            if ((i + 1) > (num.length - 1)) 
                tempNum = num;
            else
                tempNum = num.slice(0, i + 1);
        }
    }
    if (decDigitCount < 11) 
        return num;
    
    let eQuantity = "";
    if (eIndex != -1) {
        eQuantity = num.slice(eIndex);
        let newVal = 0;
        if (tempNum.slice(decIndex + 1).length > 3) 
            newVal = tempNum.slice((decIndex + 1), (decIndex + 4));
        else if (tempNum.slice(decIndex + 1).length == 3)
            newVal = tempNum.slice(decIndex + 1);
        else
            return tempNum + eQuantity;

        if (parseInt(newVal[newVal.length - 1]) > 4) 
            newVal = parseInt(newVal.slice(0, 2)) + 1;
        else
            newVal = parseInt(newVal.slice(0, 2));
        newVal = newVal.toString();

        tempNum = tempNum.slice(0, (decIndex + 1));
        if (newVal.length > 2) {
            newVal = ""
            if (tempNum[0] == "-")
                tempNum = parseInt(tempNum) - 1;
            else
             tempNum = parseInt(tempNum) + 1;
             tempNum = tempNum.toString();
        }
        else
            num = tempNum.slice(0, decIndex + 1) + newVal.toString() + eQuantity;
        num = tempNum + newVal + eQuantity;
        return num;
    }   
    
    if (parseInt(tempNum[tempNum.length - 1]) > 4){
        let newVal = 0;
        let preRoundLen = 0;
        let postRoundLen = 0;
        if (nonZeroIndex == (tempNum.length - 1)) 
            newVal = tempNum.slice(nonZeroIndex - 1);
        else 
            newVal = tempNum.slice(nonZeroIndex, (tempNum.length - 1));
        preRoundLen = newVal.length;
        newVal = parseInt(newVal) + 1;
        newVal = newVal.toString();
        postRoundLen = newVal.length;

        tempNum = tempNum.slice(0, (decIndex + 1));
        if (newVal.length > 10) {
            newVal = "";
            if (tempNum[0] == "-")
                tempNum = parseInt(tempNum) - 1;
            else
                tempNum = parseInt(tempNum) + 1;
            tempNum = tempNum.toString();
        }
        else if (postRoundLen > preRoundLen) {
            for (let i = 0; i < (decDigitCount - nonZeroDecDigitCount - 1); i++)
                tempNum = tempNum + "0";
        }
        else {
            for (let i = 0; i < (decDigitCount - nonZeroDecDigitCount); i++)
                tempNum = tempNum + "0";
        }
        num = tempNum + newVal + eQuantity;
    }   
    else 
        num = parseFloat(tempNum.slice(0, (tempNum.length - 1)));
    num = num.toString();
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
    let decIndex = -1;
    for (let i = 0; i < length; i++) {
        if (formula[i] != "," && decIndex == -1)
            nonFancy = nonFancy + formula[i];
        if (formula[i] == ".") {
            decInNum = true;
            nonFancy = nonFancy.slice(0, (nonFancy.length - 1));
            decIndex = i;
        }
        if (typeId(formula[i]) == 0 || formula[i] == ")" || formula[i] == "%" || formula[i] == "(") {
            decInNum = false;
            nonFancy = "";
            newNumStartIndex = i;
            decIndex = -1;
        } 
    }
    let nonFancyLen = nonFancy.length;
    

    if (nonFancyLen > 0 && nonFancy != "0" && formula != "ERROR" && formula != "Infinity") {
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

        if (newNumStartIndex == -1 && decIndex == -1) 
            formula = fancy;
        else if (decIndex != -1) 
            formula = formula.slice(0, (newNumStartIndex + 1)) + fancy + formula.slice(decIndex);
        else
            formula = formula.slice(0, (newNumStartIndex + 1)) + fancy;
    }
}

// Resets the calculator
function reset () {
    formula = "0";
    parsedFormula = [""];
    parsedFormulaIndex = 0;
}

function next (){
    if (parsedFormula[parsedFormulaIndex] != "") {
        parsedFormula.push("");
        parsedFormulaIndex++;
    }
}