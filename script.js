let speechSynthesisUtterance;
let speechSynthesisInstance = window.speechSynthesis;
let textToRead = "";
let wordsArray = [];
let currentWordIndex = 0;
let isPaused = false;
let highlightedTextElement = document.getElementById("highlighted-text");

function startTTS() {
    const textInput = document.getElementById("text-input").value;
    const speed = parseFloat(document.getElementById("speed").value);
    const pauseInterval = parseInt(document.getElementById("pause-interval").value, 10);
    const punctuationPause = parseFloat(document.getElementById("punctuation-pause").value);

    if (!textInput) {
        alert("Please enter text to read.");
        return;
    }

    textToRead = textInput;
    wordsArray = textToRead.split(/\s+/);
    currentWordIndex = 0;

    speechSynthesisUtterance = new SpeechSynthesisUtterance();
    speechSynthesisUtterance.rate = speed; // Apply the speed here

    speechSynthesisUtterance.onboundary = (event) => {
        highlightWord(currentWordIndex);
        if (currentWordIndex % pauseInterval === 0 && currentWordIndex !== 0) {
            pauseTTS();
            setTimeout(() => {
                resumeTTS();
            }, punctuationPause * 1000);
        }
        currentWordIndex++;
    };

    speechSynthesisUtterance.onend = () => {
        stopTTS();
    };

    startReading();
}

function startReading() {
    if (currentWordIndex < wordsArray.length) {
        speechSynthesisUtterance.text = wordsArray.slice(currentWordIndex).join(" ");
        speechSynthesisInstance.speak(speechSynthesisUtterance);
    }
}

function pauseTTS() {
    if (speechSynthesisInstance.speaking) {
        isPaused = true;
        speechSynthesisInstance.pause();
    }
}

function resumeTTS() {
    if (isPaused) {
        isPaused = false;
        speechSynthesisInstance.resume();
    }
}

function stopTTS() {
    speechSynthesisInstance.cancel();
    currentWordIndex = 0;
    highlightedTextElement.innerHTML = "";
}

function highlightWord(index) {
    highlightedTextElement.innerHTML = wordsArray
        .map((word, i) => (i === index ? `<span style="background-color: yellow">${word}</span>` : word))
        .join(" ");
}
