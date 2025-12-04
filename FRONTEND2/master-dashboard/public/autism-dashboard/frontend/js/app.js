// app.js — orchestrates quiz, ML calls, scoring, generator
let recentAcc = 0.5;
let totalAnswered = 0;
let totalCorrect = 0;
let wrongStreak = 0;
let avgRT = 4.0;
let lastDifficulty = 0.5;
let currentDifficulty = 0.5;
let xp = 0;
let stars = 0;
let recentTemplates = [];
const RECENT_LIMIT = 6;

const MQues = document.querySelector('.MQues');
const MAnsDiv = document.querySelector('.MAns');
const QNUM = document.getElementById('qnum');
const XP = document.getElementById('xp');
const STARS = document.getElementById('stars');
const DBG_DIFF = document.getElementById('dbgDiff');
const DBG_STRESS = document.getElementById('dbgStress');

let responseStart = 0;
let qcount = 0;
let paused = false;

// start the stress detector
// start with interval 1500ms (1.5s)
if(typeof window.initStressDetectorAuto === 'function'){
    window.initStressDetectorAuto(1500);
    // attach debug element if you have one
    const dbg = document.getElementById('dbgStress');
    if(dbg) window.attachStressDebugElement(dbg);
}


document.getElementById('btnPause').addEventListener('click', () => {
    paused = !paused;
    document.getElementById('btnPause').textContent = paused ? 'Resume' : 'Pause';
    if(!paused) loadNext();
});

// in app.js - after variables defined globally
// define what happens when stress popup requests difficulty reduction
window.onStressReduce = function(){
    // simple immediate action:
    // - reduce currentDifficulty and lastDifficulty so next question is easier
    currentDifficulty = Math.min(currentDifficulty, 0.2);
    lastDifficulty = currentDifficulty;
    // optional: give immediate feedback to user
    alert("We'll switch to easier questions now. Take a moment. 😊");
    // clear wrongStreak to avoid repeated difficulty traps
    wrongStreak = 0;
};


document.getElementById('btnReset').addEventListener('click', () => {
    recentAcc = 0.5; totalAnswered = 0; totalCorrect = 0; wrongStreak = 0; avgRT = 4.0;
    lastDifficulty = 0.5; currentDifficulty = 0.5; xp = 0; stars = 0; recentTemplates = [];
    qcount = 0;
    updateStats();
    loadNext();
});

function updateStats(){
    QNUM.textContent = qcount;
    XP.textContent = xp;
    STARS.textContent = stars;
}

async function loadNext(){
    if(paused) return;
    qcount++;
    // compute features
    const stress = getStressLevel(); // placeholder
    DBG_STRESS.textContent = stress.toFixed(2);

    const features = {
        recent_acc: recentAcc,
        global_acc: totalAnswered===0 ? recentAcc : (totalCorrect / Math.max(1,totalAnswered)),
        avg_rt: avgRT,
        recent_rt: avgRT,
        wrong_streak: Math.min(wrongStreak, 10),
        stress: stress,
        last_diff: lastDifficulty
    };

    // call backend ML
    const predicted = await fetchDifficulty(features);
    currentDifficulty = predicted;
    DBG_DIFF.textContent = currentDifficulty.toFixed(2);

    // if stress high or wrong streak high, force easier
    if(features.stress > 0.7 || features.wrong_streak >= 3){
        currentDifficulty = Math.min(currentDifficulty, 0.25);
    }

    // generate question
    const q = generateRandomQuestion(currentDifficulty, new Set(recentTemplates));

    // keep recent template IDs
    recentTemplates.push(q.templateId);
    if(recentTemplates.length > RECENT_LIMIT) recentTemplates.shift();

    // render
    MQues.querySelector('p').textContent = q.text;
    MAnsDiv.innerHTML = '';
    q.options.forEach(op => {
        const btn = document.createElement('button');
        btn.textContent = op.text;
        btn.onclick = () => handleAnswer(op.correct, q, op.text);
        MAnsDiv.appendChild(btn);
    });

    responseStart = Date.now();
    updateStats();
}

async function handleAnswer(isCorrect, questionObj, chosenText){
    const rt = (Date.now() - responseStart) / 1000.0;
    totalAnswered++;
    if(isCorrect){
        totalCorrect++;
        wrongStreak = 0;
        // update recentAcc decaying approach
        recentAcc = (recentAcc + 1) / 2;
        xp += 10;
        // small star logic
        if(rt < avgRT) stars++;
    } else {
        wrongStreak++;
        recentAcc = recentAcc / 2;
        xp += 2;
    }

    // update avgRT (simple moving average)
    avgRT = (avgRT + rt) / 2.0;

    // log outcome to backend for retraining later
    const logRow = {
        user_id: "demo_user",
        recent_acc: recentAcc,
        global_acc: totalCorrect / totalAnswered,
        avg_rt: avgRT,
        recent_rt: avgRT,
        wrong_streak: wrongStreak,
        stress: getStressLevel(),
        last_diff: lastDifficulty,
        chosen_diff: currentDifficulty,
        was_correct: !!isCorrect,
        question_template: questionObj.templateId,
        question_text: questionObj.text
    };
    // fire-and-forget
    logOutcome(logRow);

    // UI feedback
    // highlight button: find matching button and color it
    const buttons = Array.from(MAnsDiv.querySelectorAll('button'));
    buttons.forEach(b => {
        if(b.textContent === chosenText){
            b.classList.add(isCorrect ? 'correct' : 'wrong');
        }
        b.disabled = true;
    });

    // store lastDifficulty and advance
    lastDifficulty = currentDifficulty;

    // delay then next
    setTimeout(() => {
        // remove classes
        buttons.forEach(b => { b.classList.remove('correct','wrong'); b.disabled = false; });
        loadNext();
    }, 700);
}

// start
updateStats();
loadNext();
