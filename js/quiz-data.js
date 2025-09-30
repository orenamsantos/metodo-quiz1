/**
 * Quiz data and calculation logic for Método Africano
 * Optimized and cleaned version
 */

// Quiz questions data based on the provided images
const quizData = [
    {
        id: 1,
        question: "Qual é o tamanho aproximado do seu cajado ereto?",
        type: "multiple-choice",
        options: [
            { value: "menos-12", text: "Menos de 12 cm" },
            { value: "12-14", text: "De 12 a 14 cm" },
            { value: "14-16", text: "De 14 a 16 cm" },
            { value: "mais-16", text: "Mais de 16 cm" }
        ]
    },
    {
        id: 2,
        question: "Com que frequência você se masturba?",
        type: "multiple-choice",
        options: [
            { value: "mais-uma-vez", text: "Mais de uma vez por dia" },
            { value: "todos-dias", text: "Todos os dias" },
            { value: "2-4-semana", text: "De 2 a 4 vezes por semana" },
            { value: "raramente", text: "Raramente" }
        ]
    },
    {
        id: 3,
        question: "Você costuma acordar com o cajado ereto?",
        type: "multiple-choice",
        options: [
            { value: "quase-nunca", text: "Quase nunca" },
            { value: "raramente", text: "Raramente" },
            { value: "as-vezes", text: "Às vezes" },
            { value: "quase-sempre", text: "Quase sempre" }
        ]
    },
    {
        id: 4,
        question: "Você já tentou algum método natural para aumentar o cajado?",
        type: "multiple-choice",
        options: [
            { value: "nunca-ouvi", text: "Nunca ouvi falar" },
            { value: "ouvi-nunca-tentei", text: "Já ouvi falar, mas nunca tentei" },
            { value: "tentei-sem-constancia", text: "Já tentei, mas sem constância" },
            { value: "sim-disciplina", text: "Sim, fiz com disciplina" }
        ]
    },
    {
        id: 5,
        question: "Como é sua dieta diária?",
        type: "multiple-choice",
        options: [
            { value: "processada", text: "Apenas comida processada (refrigerantes, fast food, doces)" },
            { value: "50-50", text: "50% comida processada, 50% saudável" },
            { value: "bem-maioria", text: "Tento comer bem na maioria das refeições" },
            { value: "natural-equilibrada", text: "Dieta natural e equilibrada" }
        ]
    },
    {
        id: 6,
        question: "Quantas horas você dorme por noite?",
        type: "multiple-choice",
        options: [
            { value: "menos-5", text: "Menos de 5 horas" },
            { value: "5-6", text: "De 5 a 6 horas" },
            { value: "6-7", text: "De 6 a 7 horas" },
            { value: "8-mais", text: "8 horas ou mais" }
        ]
    },
    {
        id: 7,
        question: "Você pratica atividade física?",
        type: "multiple-choice",
        options: [
            { value: "nunca", text: "Nunca" },
            { value: "uma-semana", text: "Uma vez por semana ou menos" },
            { value: "2-3-semana", text: "De 2 a 3 vezes por semana" },
            { value: "4-mais", text: "4 vezes por semana ou mais" }
        ]
    },
    {
        id: 8,
        question: "Qual é a sua idade?",
        type: "multiple-choice",
        options: [
            { value: "12-18", text: "Entre 12 e 18 anos" },
            { value: "19-27", text: "Entre 19 e 27 anos" },
            { value: "28-36", text: "Entre 28 e 36 anos" },
            { value: "mais-36", text: "Mais de 36 anos" }
        ]
    },
    {
        id: 9,
        question: "Qual é o tamanho atual do seu cajado em ereção?",
        type: "input",
        inputType: "number",
        placeholder: "Digite o tamanho em cm",
        helpText: "Digite um valor entre 1 e 50 centímetros",
        validation: {
            min: 1,
            max: 50,
            required: true
        },
        warningInfo: {
            title: "Importante:",
            text: "Esta informação é completamente confidencial e é utilizada apenas para criar seu protocolo personalizado."
        }
    }
];

/**
 * Calculate personalized results based on user answers
 * @param {Object} answers - User answers object with question indices as keys
 * @returns {Object} Results object with calculated values
 */
function calculateResults(answers) {
    // Get current size from last question or use default
    let currentSize = parseFloat(answers[8]) || 12;
    
    // Base potential increase
    let potentialIncrease = 7;
    
    // Adjust potential based on size category (question 1)
    const sizeCategory = answers[0];
    switch (sizeCategory) {
        case 'menos-12':
            potentialIncrease = 8;
            break;
        case '12-14':
            potentialIncrease = 7;
            break;
        case '14-16':
            potentialIncrease = 6;
            break;
        case 'mais-16':
            potentialIncrease = 5;
            break;
    }
    
    // Masturbation frequency impact (question 2)
    const masturbationFreq = answers[1];
    switch (masturbationFreq) {
        case 'mais-uma-vez':
            potentialIncrease -= 1;
            break;
        case 'raramente':
            potentialIncrease += 1;
            break;
    }
    
    // Morning erections - health indicator (question 3)
    const morningErections = answers[2];
    switch (morningErections) {
        case 'quase-nunca':
            potentialIncrease -= 1;
            break;
        case 'quase-sempre':
            potentialIncrease += 1;
            break;
    }
    
    // Previous attempts experience (question 4)
    const previousAttempts = answers[3];
    switch (previousAttempts) {
        case 'sim-disciplina':
            potentialIncrease += 1;
            break;
        case 'nunca-ouvi':
            potentialIncrease += 0.5;
            break;
    }
    
    // Diet quality impact (question 5)
    const dietQuality = answers[4];
    switch (dietQuality) {
        case 'processada':
            potentialIncrease -= 1;
            break;
        case 'natural-equilibrada':
            potentialIncrease += 1;
            break;
    }
    
    // Sleep quality impact (question 6)
    const sleepHours = answers[5];
    switch (sleepHours) {
        case 'menos-5':
            potentialIncrease -= 1;
            break;
        case '8-mais':
            potentialIncrease += 1;
            break;
    }
    
    // Physical activity impact (question 7)
    const physicalActivity = answers[6];
    switch (physicalActivity) {
        case 'nunca':
            potentialIncrease -= 1;
            break;
        case '4-mais':
            potentialIncrease += 1;
            break;
    }
    
    // Age factor (question 8)
    const ageGroup = answers[7];
    switch (ageGroup) {
        case '12-18':
            potentialIncrease += 1;
            break;
        case 'mais-36':
            potentialIncrease -= 0.5;
            break;
    }
    
    // Ensure realistic bounds
    potentialIncrease = Math.max(3, Math.min(10, potentialIncrease));
    
    // Round to nearest integer
    potentialIncrease = Math.round(potentialIncrease);
    
    return {
        currentSize: currentSize,
        potentialIncrease: potentialIncrease,
        potentialSize: currentSize + potentialIncrease,
        successRate: 97, // Fixed success rate as shown in images
        timeRequired: 15, // Minutes per day
        programDuration: 30 // Days
    };
}

/**
 * Validate user input for numeric questions
 * @param {string} value - Input value to validate
 * @param {Object} validation - Validation rules
 * @returns {Object} Validation result with isValid and message
 */
function validateInput(value, validation) {
    const result = {
        isValid: true,
        message: ''
    };
    
    if (!value || value.trim() === '') {
        if (validation.required) {
            result.isValid = false;
            result.message = 'Este campo é obrigatório';
        }
        return result;
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        result.isValid = false;
        result.message = 'Por favor, digite um número válido';
        return result;
    }
    
    if (validation.min !== undefined && numValue < validation.min) {
        result.isValid = false;
        result.message = `O valor deve ser maior que ${validation.min}`;
        return result;
    }
    
    if (validation.max !== undefined && numValue > validation.max) {
        result.isValid = false;
        result.message = `O valor deve ser menor que ${validation.max}`;
        return result;
    }
    
    return result;
}

/**
 * Get total number of questions
 * @returns {number} Total questions count
 */
function getTotalQuestions() {
    return quizData.length;
}

/**
 * Get question by index
 * @param {number} index - Question index (0-based)
 * @returns {Object|null} Question object or null if not found
 */
function getQuestion(index) {
    return quizData[index] || null;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        quizData,
        calculateResults,
        validateInput,
        getTotalQuestions,
        getQuestion
    };
}
