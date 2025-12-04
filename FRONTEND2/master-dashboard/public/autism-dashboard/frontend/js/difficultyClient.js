// difficultyClient.js
const ML_SERVER = 'http://localhost:5000';

async function fetchDifficulty(features){
    try {
        const res = await fetch(`${ML_SERVER}/predict`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(features)
        });
        const json = await res.json();
        if(res.ok) return json.difficulty;
        console.error('Predict error', json);
        return 0.5;
    } catch(e){
        console.error('Predict fetch failed', e);
        return 0.5;
    }
}

async function logOutcome(row){
    try {
        await fetch(`${ML_SERVER}/log`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(row)
        });
    } catch(e){
        console.warn('Log failed', e);
    }
}
