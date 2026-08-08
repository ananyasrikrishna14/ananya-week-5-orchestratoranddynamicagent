const state = {
  nutritionist: true,
  chef: true,
  fitnessCoach: true,
};

const resultsEl = document.getElementById('results');
const traceEl = document.getElementById('trace');
const runButton = document.getElementById('runButton');
const userPromptEl = document.getElementById('userPrompt');
const toggles = document.querySelectorAll('.toggle-btn');

function updateToggleButton(button, enabled) {
  button.textContent = enabled ? 'ON' : 'OFF';
  button.classList.toggle('on', enabled);
  button.classList.toggle('off', !enabled);
}

function logTrace(message) {
  if (traceEl.querySelector('.empty-state')) {
    traceEl.innerHTML = '';
  }
  const entry = document.createElement('div');
  entry.className = 'trace-item';
  entry.innerHTML = `<h3>Trace</h3><p>${message}</p>`;
  traceEl.appendChild(entry);
}

function displayResult(title, content) {
  if (resultsEl.querySelector('.empty-state')) {
    resultsEl.innerHTML = '';
  }
  const card = document.createElement('div');
  card.className = 'results-item';
  card.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
  resultsEl.appendChild(card);
}

function nutritionist(input) {
  const prompt = input.text || 'a basic meal plan';
  const output = `Nutritionist analysed the input and created a nutrient-rich plan with 3 balanced meals, low sugar snacks, and hydration reminders based on: "${prompt}".`;
  return { text: output, summary: 'Balanced nutrition plan with meal timing and macros.' };
}

function chef(input) {
  const nutritionSummary = input.summary || 'healthy nutrition guidelines';
  const output = `Chef converted the nutrition summary into a set of recipes: grilled lemon chicken bowl, roasted veggie quinoa salad, and a protein-packed smoothie. Source: "${nutritionSummary}".`;
  return { text: output, summary: 'Recipe plan tailored for ingredients and flavors.' };
}

function fitnessCoach(input) {
  const recipePlan = input.summary || 'meal-based energy guidance';
  const output = `Fitness Coach suggested a workout schedule aligned with the meal plan: morning mobility, strength training after lunch, and evening stretch cooldown. Based on: "${recipePlan}".`;
  return { text: output, summary: 'Fitness plan supporting nutrition and recovery.' };
}

function runOrchestrator() {
  resultsEl.innerHTML = '';
  traceEl.innerHTML = '';

  const activeAgents = Object.entries(state)
    .filter(([, enabled]) => enabled)
    .map(([agent]) => agent);

  if (activeAgents.length === 0) {
    displayResult('No Agents Active', 'Toggle at least one agent ON to run the orchestrator.');
    logTrace('Orchestrator did not run because all agents are OFF.');
    return;
  }

  const userPrompt = userPromptEl.value.trim();
  const initialMessage = userPrompt || 'A balanced meal plan for general health and energy.';
  logTrace(`User prompt received: "${initialMessage}"`);
  let currentOutput = { text: initialMessage };

  if (state.nutritionist) {
    logTrace('Nutritionist agent is ON. Passing initial context to Nutritionist.');
    currentOutput = nutritionist(currentOutput);
    displayResult('Nutritionist Output', currentOutput.text);
  } else {
    logTrace('Nutritionist agent is OFF. Skipping to next active agent.');
  }

  if (state.chef) {
    logTrace('Chef agent is ON. Passing Nutritionist output to Chef.');
    currentOutput = chef(currentOutput);
    displayResult('Chef Output', currentOutput.text);
  } else {
    logTrace('Chef agent is OFF. Skipping to next active agent.');
  }

  if (state.fitnessCoach) {
    logTrace('Fitness Coach agent is ON. Passing Chef output to Fitness Coach.');
    currentOutput = fitnessCoach(currentOutput);
    displayResult('Fitness Coach Output', currentOutput.text);
  } else {
    logTrace('Fitness Coach agent is OFF. Workflow ended with the previous agent output.');
  }

  logTrace('Orchestrator finished. Only ON agents executed in order.');
}

function initialize() {
  toggles.forEach((button) => {
    const agent = button.dataset.agent;
    updateToggleButton(button, state[agent]);
    button.addEventListener('click', () => {
      state[agent] = !state[agent];
      updateToggleButton(button, state[agent]);
      logTrace(`${agent.charAt(0).toUpperCase() + agent.slice(1)} toggled ${state[agent] ? 'ON' : 'OFF'}.`);
    });
  });

  runButton.addEventListener('click', runOrchestrator);
}

initialize();
