const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector('#lowercase')
const numbersCheck = document.querySelector('#numbers')
const symbolsCheck = document.querySelector('#symbols')
const indicator =document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateBtn');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");


const symbols = '~!@#$%^&*()_-+={}[];:<>,?/';

let password ="";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

// set strength circle color grey
setIndicator("#ccc");



// set password length to UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}



// set color of indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// to get random integer between min and max
function getRadInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// generate number
function generateRandomNumber(){
    return getRadInteger(0,9);
}

function generateLowercase(){
    return  String.fromCharCode(getRadInteger(97,123));
}

function generateUppercase(){
    return  String.fromCharCode(getRadInteger(65,91));
}

function generateSymbol(){
    const randomNum = getRadInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}


// calculate strength of password
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum|| hasSym) && passwordLength >=6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// copy content
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");
   
    setTimeout( () => {
    copyMsg.classList.remove("active");
    },2000);

}

function handleCheckBoxChange(){
    checkCount= 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount ++;
    })

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// adding event listener to slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// adding event listener to copy button
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
}); 







// shuffle password
function shufflePassword(array){
    // fisher yates method
    for(let i = array.length-1 ; i>0 ;i--){
        // random J , find using random function
        const j = Math.floor(Math.random() * (i + 1));
        
        // swaping number at i and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

// generate password

// add event listener to generate button
generateBtn.addEventListener('click', () => {

    // none of the checkbox are selected
    if(checkCount == 0)  return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let start to find new password
    console.log("starting the journey");
    // remove old password
    password = "";

    // lets put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password += generateUppercase;
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase;
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber;
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol;
    // }

    var funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    
    for(let i=0; i<funcArr.length ;i++){
        password += funcArr[i]();
    }
    console.log("compulsury addition done");

    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRadInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("remaining done");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");

    // show in UI
    passwordDisplay.value = password;
    console.log("ui addition done");

    // claculate strength
    calcStrength();

});









