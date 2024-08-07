document.addEventListener("DOMContentLoaded", function() {
    const questionsElement = document.getElementById("questions");
    const resultElement = document.getElementById("result");
    const formElement = document.getElementById("quiz-form");

    let questions = [];
    let answers = {};

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestions();
        });

    fetch('answers.json')
        .then(response => response.json())
        .then(data => {
            answers = data;
        });

    function displayQuestions() {
        questionsElement.innerHTML = questions.map((question, index) => 
            `<div>
                <label>${question.text}</label><br>
                <label><input type="radio" name="q${index}" value="yes"> Yes</label>
                <label><input type="radio" name="q${index}" value="no"> No</label>
            </div>`
        ).join('');
    }

    formElement.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(formElement);
        let userAnswers = '';

        for (let i = 0; i < questions.length; i++) {
            userAnswers += formData.get(`q${i}`) || 'no';
        }

        const diagnosis = answers[userAnswers] || 'No matching diagnosis found';
        resultElement.textContent = diagnosis;
    });
});
