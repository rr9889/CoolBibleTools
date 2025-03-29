let currentQuestion = 'q1';
let baseScore = 0; // "Yes" or "Some apostolic" to base questions
let trapScore = 0; // "Universal/Creation/Scripture/Obedience/Rule/Matters/Veil/Required/Distinct" in follow-ups
let answers = {};
let questionOrder = ['q1'];

function nextQuestion() {
    const form = document.getElementById('quizForm');
    const current = document.getElementById(currentQuestion);
    const selected = form.querySelector(`input[name="${currentQuestion}"]:checked`);

    if (!selected) {
        alert('Please answer the question!');
        return;
    }

    answers[currentQuestion] = selected.value;

    if (['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].includes(currentQuestion)) {
        baseScore += parseInt(selected.value);
    } else if (['q1a', 'q1b', 'q2a', 'q3a', 'q4a', 'q5a', 'q5b', 'q6a', 'q7a', 'q8a'].includes(currentQuestion)) {
        trapScore += parseInt(selected.value);
    }

    current.classList.remove('active');

    let nextQ;
    if (currentQuestion === 'q1') {
        nextQ = selected.value === '1' ? 'q1a' : 'q2';
    } else if (currentQuestion === 'q1a') {
        nextQ = selected.value === '1' ? 'q1b' : 'q2';
    } else if (currentQuestion === 'q1b') {
        nextQ = 'q2';
    } else if (currentQuestion === 'q2') {
        nextQ = selected.value === '1' ? 'q2a' : 'q3';
    } else if (currentQuestion === 'q2a') {
        nextQ = 'q3';
    } else if (currentQuestion === 'q3') {
        nextQ = selected.value === '1' ? 'q3a' : 'q4';
    } else if (currentQuestion === 'q3a') {
        nextQ = 'q4';
    } else if (currentQuestion === 'q4') {
        nextQ = selected.value === '1' ? 'q4a' : 'q5';
    } else if (currentQuestion === 'q4a') {
        nextQ = 'q5';
    } else if (currentQuestion === 'q5') {
        nextQ = selected.value === '1' ? 'q5a' : 'q6';
    } else if (currentQuestion === 'q5a') {
        nextQ = selected.value === '1' ? 'q5b' : 'q6';
    } else if (currentQuestion === 'q5b') {
        nextQ = 'q6';
    } else if (currentQuestion === 'q6') {
        nextQ = selected.value === '1' ? 'q6a' : 'q7';
    } else if (currentQuestion === 'q6a') {
        nextQ = 'q7';
    } else if (currentQuestion === 'q7') {
        nextQ = selected.value === '1' ? 'q7a' : 'q8';
    } else if (currentQuestion === 'q7a') {
        nextQ = 'q8';
    } else if (currentQuestion === 'q8') {
        nextQ = selected.value === '1' ? 'q8a' : null;
    } else if (currentQuestion === 'q8a') {
        nextQ = null;
    }

    if (nextQ) {
        currentQuestion = nextQ;
        questionOrder.push(nextQ);
        document.getElementById(nextQ).classList.add('active');
        document.getElementById('prevBtn').style.display = 'inline-block';
    } else {
        document.getElementById('submitBtn').style.display = 'inline-block';
        document.getElementById('nextBtn').style.display = 'none';
    }
}

function prevQuestion() {
    if (questionOrder.length <= 1) return;

    const current = document.getElementById(currentQuestion);
    current.classList.remove('active');

    if (['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].includes(currentQuestion)) {
        baseScore -= parseInt(answers[currentQuestion]);
    } else if (['q1a', 'q1b', 'q2a', 'q3a', 'q4a', 'q5a', 'q5b', 'q6a', 'q7a', 'q8a'].includes(currentQuestion)) {
        trapScore -= parseInt(answers[currentQuestion]);
    }

    delete answers[currentQuestion];
    questionOrder.pop();
    currentQuestion = questionOrder[questionOrder.length - 1];
    document.getElementById(currentQuestion).classList.add('active');

    if (questionOrder.length === 1) {
        document.getElementById('prevBtn').style.display = 'none';
    }
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('redoBtn').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}

function calculateResult() {
    const resultDiv = document.getElementById('result');
    let diagnosis, hypocrisy, knowledgeGap = "";

    let allTrapsConsistent = baseScore === 8 && trapScore === 10; // Adjusted for q1b

    if (allTrapsConsistent) {
        diagnosis = "You affirm all principles and head coverings as a universal apostolic teaching. No hypocrisy.";
        hypocrisy = "No contradictions.";
    } else if (baseScore === 0) {
        diagnosis = "You reject all principles and head coverings. No hypocrisy.";
        hypocrisy = "No contradictions. You deny scripture’s authority fully.";
    } else if (baseScore === 8) {
        diagnosis = "You affirm all principles but reject head coverings’ universal scope. This is hypocrisy.";
        hypocrisy = "Contradictions: ";
        if (answers.q1a === '0') hypocrisy += "You said scripture rules but called head covering cultural, not universal (1 Cor. 11:10). ";
        if (answers.q1b === '0') hypocrisy += "You missed 'in every place' (1 Cor. 1:2), implying Paul’s rules were only for Corinth. ";
        if (answers.q2a === '0') hypocrisy += "You said creation matters but called head covering customs, not creation (1 Cor. 11:7-9). ";
        if (answers.q3a === '0') hypocrisy += "You said scripture guides but chose today’s practices over head covering (1 Cor. 11:2). ";
        if (answers.q4a === '0') hypocrisy += "You said acts reflect heart but called head covering a display, not obedience (1 Cor. 11:6). ";
        if (answers.q5a === '0') hypocrisy += "You said Paul binds all but called head covering optional, not a rule (1 Cor. 11:16). ";
        if (answers.q5b === '0') hypocrisy += "You said Paul binds all but said we can ignore it (1 Cor. 11:16). ";
        if (answers.q6a === '0') hypocrisy += "You said plain text rules but called head covering hair, not a veil (1 Cor. 11:5-6). ";
        if (answers.q7a === '0') hypocrisy += "You said obedience is required but called head covering a minor detail (1 Cor. 11:2). ";
        if (answers.q8a === '0') hypocrisy += "You equated head covering with holy kiss, ignoring its unique theological basis (1 Cor. 11:7-9). ";
        knowledgeGap = "Note: Unlike holy kiss, head covering is tied to creation order (1 Cor. 11:7-9) and intended ‘in every place’ (1 Cor. 1:2).";
    } else if (baseScore >= 6) {
        diagnosis = "You affirm most principles but deny head coverings’ full weight. Partial hypocrisy.";
        hypocrisy = "Contradictions: ";
        if (answers.q1 === '0') hypocrisy += "You denied scripture’s authority (1 Cor. 11:10). ";
        if (answers.q1 === '1' && answers.q1a === '0') hypocrisy += "You said scripture rules but called head covering cultural (1 Cor. 11:10). ";
        if (answers.q1b === '0') hypocrisy += "You overlooked 'in every place' (1 Cor. 1:2), limiting Paul’s intent. ";
        if (answers.q2 === '0') hypocrisy += "You denied creation matters (1 Cor. 11:7-9). ";
        if (answers.q2 === '1' && answers.q2a === '0') hypocrisy += "You said creation matters but called head covering customs (1 Cor. 11:7-9). ";
        if (answers.q3 === '0') hypocrisy += "You denied scripture guides over trends (1 Cor. 11:2). ";
        if (answers.q3 === '1' && answers.q3a === '0') hypocrisy += "You said scripture guides but chose today’s practices (1 Cor. 11:2). ";
        if (answers.q4 === '0') hypocrisy += "You denied acts reflect heart (1 Cor. 11:6). ";
        if (answers.q4 === '1' && answers.q4a === '0') hypocrisy += "You said acts reflect heart but called head covering a display (1 Cor. 11:6). ";
        if (answers.q5 === '0') hypocrisy += "You denied Paul binds all (1 Cor. 11:16). ";
        if (answers.q5 === '1' && answers.q5a === '0') hypocrisy += "You said Paul binds all but called head covering optional (1 Cor. 11:16). ";
        if (answers.q5 === '1' && answers.q5b === '0') hypocrisy += "You said Paul binds all but said we can ignore it (1 Cor. 11:16). ";
        if (answers.q6 === '0') hypocrisy += "You denied plain text rules (1 Cor. 11:5-6). ";
        if (answers.q6 === '1' && answers.q6a === '0') hypocrisy += "You said plain text rules but called head covering hair (1 Cor. 11:5-6). ";
        if (answers.q7 === '0') hypocrisy += "You denied obedience is required in all teachings (1 Cor. 11:2). ";
        if (answers.q7 === '1' && answers.q7a === '0') hypocrisy += "You said obedience is required but called head covering a minor detail (1 Cor. 11:2). ";
        if (answers.q8 === '0') hypocrisy += "You said all instructions are cultural (1 Cor. 11:2). ";
        if (answers.q8 === '1' && answers.q8a === '0') hypocrisy += "You affirmed apostolic authority but lumped head covering with holy kiss, missing its deeper basis (1 Cor. 11:7-9). ";
        knowledgeGap = "Note: Holy kiss lacks the theological grounding of head covering (creation order, 1 Cor. 11:7-9) and the scope of ‘in every place’ (1 Cor. 1:2).";
    } else {
        diagnosis = "Mixed views on scripture and head coverings.";
        hypocrisy = "Contradictions: ";
        if (answers.q1 === '0') hypocrisy += "You denied scripture’s authority (1 Cor. 11:10). ";
        if (answers.q1 === '1' && (!answers.q1a || answers.q1a === '0')) hypocrisy += "You said scripture rules but called head covering cultural (1 Cor. 11:10). ";
        if (answers.q1b === '0') hypocrisy += "You missed the universal scope of 'in every place' (1 Cor. 1:2). ";
        if (answers.q2 === '0') hypocrisy += "You denied creation matters (1 Cor. 11:7-9). ";
        if (answers.q2 === '1' && (!answers.q2a || answers.q2a === '0')) hypocrisy += "You said creation matters but called head covering customs (1 Cor. 11:7-9). ";
        if (answers.q3 === '0') hypocrisy += "You denied scripture guides over trends (1 Cor. 11:2). ";
        if (answers.q3 === '1' && (!answers.q3a || answers.q3a === '0')) hypocrisy += "You said scripture guides but chose today’s practices (1 Cor. 11:2). ";
        if (answers.q4 === '0') hypocrisy += "You denied acts reflect heart (1 Cor. 11:6). ";
        if (answers.q4 === '1' && (!answers.q4a || answers.q4a === '0')) hypocrisy += "You said acts reflect heart but called head covering a display (1 Cor. 11:6). ";
        if (answers.q5 === '0') hypocrisy += "You denied Paul binds all (1 Cor. 11:16). ";
        if (answers.q5 === '1' && (!answers.q5a || answers.q5a === '0')) hypocrisy += "You said Paul binds all but called head covering optional (1 Cor. 11:16). ";
        if (answers.q5 === '1' && (!answers.q5b || answers.q5b === '0')) hypocrisy += "You said Paul binds all but said we can ignore it (1 Cor. 11:16). ";
        if (answers.q6 === '0') hypocrisy += "You denied plain text rules (1 Cor. 11:5-6). ";
        if (answers.q6 === '1' && (!answers.q6a || answers.q6a === '0')) hypocrisy += "You said plain text rules but called head covering hair (1 Cor. 11:5-6). ";
        if (answers.q7 === '0') hypocrisy += "You denied obedience is required in all teachings (1 Cor. 11:2). ";
        if (answers.q7 === '1' && (!answers.q7a || answers.q7a === '0')) hypocrisy += "You said obedience is required but called head covering a minor detail (1 Cor. 11:2). ";
        if (answers.q8 === '0') hypocrisy += "You said all instructions are cultural (1 Cor. 11:2). ";
        if (answers.q8 === '1' && (!answers.q8a || answers.q8a === '0')) hypocrisy += "You affirmed apostolic authority but lumped head covering with holy kiss (1 Cor. 11:7-9). ";
        knowledgeGap = "Note: Head covering, unlike holy kiss, reflects creation order (1 Cor. 11:7-9) and applies ‘in every place’ (1 Cor. 1:2).";
    }

    resultDiv.innerHTML = `
        <h2>Results</h2>
        <p>${diagnosis}</p>
        <p>${hypocrisy}</p>
        <p>${knowledgeGap}</p>
    `;
    resultDiv.style.display = 'block';
    document.getElementById('redoBtn').style.display = 'inline-block';
}

function redoQuiz() {
    const form = document.getElementById('quizForm');
    form.reset();
    baseScore = 0;
    trapScore = 0;
    answers = {};
    questionOrder = ['q1'];
    currentQuestion = 'q1';

    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    document.getElementById('q1').classList.add('active');
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('redoBtn').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}