document.addEventListener('DOMContentLoaded', function() {
    // Fetch questions when the DOM content is loaded
    fetchQuestions();
});

function fetchQuestions() {
    fetch('/questions.json')
        .then(response => response.json())
        .then(questions => {
            renderQuestions(questions);
            // Attach event listener to the submit button after rendering questions
            const submitButton = document.getElementById('submit');
            submitButton.addEventListener('click', submitAnswers);
        })
        .catch(error => console.error('Error fetching questions:', error));
}

function renderQuestions(questions) {
    const form = document.getElementById('questions');
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>${question.text}</p>
            <input type="radio" name="q${question.id}" value="yes"> Yes
            <input type="radio" name="q${question.id}" value="no"> No
        `;
        form.appendChild(questionElement);
    });
}

function submitAnswers() {
    const answers = {};
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // Collect selected answers
    radioButtons.forEach(radioButton => {
        if (radioButton.checked) {
            const questionId = radioButton.name.replace('q', '');
            answers[questionId] = radioButton.value;
        }
    });

    // Check if all questions are answered
    const questionCount = document.querySelectorAll('#questions div').length;
    if (Object.keys(answers).length !== questionCount) {
        document.getElementById('result').innerHTML = "<div>Please answer all questions.</div>";
        document.getElementById('resultImage').src = ""; // Clear the image
        return;
    }
    storeAnswersToFile(answers)
    // Process answers locally
     // Process answers and display result
     processAnswers(answers)
     .then(resultMessage => displayResult(resultMessage))
     .catch(error => {
         console.error('Error processing answers:', error);
         displayResult("An error occurred while processing answers");
     });

}

async function processAnswers(answers) {
    try {
        // Fetch answer combinations from answers.json
        const response = await fetch('/answers.json');
        if (!response.ok) {
            throw new Error('Failed to fetch answer combinations');
        }
        const combinations = await response.json();

        // Combine answers to form a key for combinations lookup
        const key = Object.values(answers).join('');

        // Check if the key matches any combination
        const resultMessage = combinations[key] || "No matching result found.";

        return resultMessage;
    } catch (error) {
        console.error('Error processing answers:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

function displayResult(resultMessage) {
    document.getElementById('message').innerText = resultMessage;
    
    // Fetch image based on the result message
    fetch('/images.json')
        .then(response => response.json())
        .then(images => {
            const imageSource = images[resultMessage.trim()] || "/nodata.jpg";
            document.getElementById('resultImage').src = '/images/' + imageSource;
        })
        .catch(error => console.error('Error fetching images:', error));
}


function storeAnswersToFile(answers) {
    fetch('http://localhost:3000/saveAnswers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit answers');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response data
        console.log(data);
    })
    .catch(error => {
        console.error('Error submitting answers:', error);
    });
}
