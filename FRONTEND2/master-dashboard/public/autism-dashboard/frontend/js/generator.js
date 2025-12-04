(function(global){
  function random(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr){ return arr.slice().sort(()=> Math.random() - 0.5); }
  function pickN(arr, n){
    const copy = arr.slice();
    const out = [];
    for(let i=0;i<n && copy.length>0;i++){
      out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]);
    }
    return out;
  }
  function clamp(v,min=0,max=1){ return Math.max(min, Math.min(max, v)); }

  function difficultyToParams(score){
    score = clamp(score);
    if(score < 0.33) return {level:'easy', opts:3, distractorPool:'easy', requireInference:false};
    if(score < 0.66) return {level:'medium', opts:3, distractorPool:'medium', requireInference:false};
    return {level:'hard', opts:4, distractorPool:'hard', requireInference:true};
  }

  function buildOptions(correctText, pool, optsCount){
    const filtered = pool.filter(x => x !== correctText);
    const wrongs = pickN(filtered, optsCount - 1);
    const choices = [{text: correctText, correct: true}, ...wrongs.map(w => ({text:w, correct:false}))];
    return shuffle(choices);
  }

  const categorySamples = {
    food: ['apple','banana','orange','grapes','bread'],
    clothing: ['shoes','cap','shirt','socks','jacket'],
    vehicle: ['car','bus','cycle','train','truck'],
    tool: ['scissors','spoon','fork','hammer','brush'],
    animal: ['dog','cat','bird','fish','cow'],
    place: ['school','park','home','library','kitchen']
  };

  function fillTemplate(text, mapping){
    let out = text;
    for(const k in mapping){
      const re = new RegExp('\\{'+k+'\\}','g');
      out = out.replace(re, mapping[k]);
    }
    return out;
  }

  function generateFromTemplateObj(tpl, params){
    const level = params.level;
    const opts = params.opts;
    const dp = params.distractorPool;
    const score = params.difficultyScore;

    let questionText = tpl.template;
    let options = [];
    let meta = {};

    switch(tpl.type){
      case 'emotion': {
        const emotions = ['happy','sad','angry','surprised','scared','confused','bored','excited'];
        const correct = random(emotions);
        const pool = distractors.emotion[dp] || distractors.emotion.easy;
        options = buildOptions(correct, pool.concat(emotions), opts);
        questionText = fillTemplate(questionText, {emotion: correct});
        meta = {category:'emotion', emotion: correct};
        break;
      }

      case 'emotion_scenario': {
        const actionToEmotion = [
          {action:'smiling and jumping','emotion':'happy'},
          {action:'holding a broken toy','emotion':'sad'},
          {action:'frowning with crossed arms','emotion':'angry'},
          {action:'hands over a gift','emotion':'thankful'},
          {action:'eyes wide and mouth open','emotion':'surprised'}
        ];
        const pair = random(actionToEmotion);
        const pool = distractors.emotion[dp] || distractors.emotion.easy;
        options = buildOptions(pair.emotion, pool, opts);
        questionText = fillTemplate(questionText, {action: pair.action});
        meta = {category:'emotion_scenario', emotion:pair.emotion};
        break;
      }

      case 'manners': {
        const correct = 'Thank you';
        const pool = distractors.manners[dp] || distractors.manners.easy;
        options = buildOptions(correct, pool, opts);
        meta = {category:'manners'};
        break;
      }

      case 'greeting': {
        const correct = 'Hello';
        const pool = distractors.greeting ? distractors.greeting[params.level] || distractors.greeting.easy : ['Hello','Bye','Stay silent'];
        options = buildOptions(correct, pool, opts);
        meta = {category:'greeting'};
        break;
      }

      case 'sharing': {
        const correct = 'Share or take turns';
        const pool = distractors.sharing ? distractors.sharing[params.level] || distractors.sharing.easy : ['Share or take turns','Keep it','Run away'];
        options = buildOptions(correct, pool, opts);
        meta = {category:'sharing'};
        break;
      }

      case 'safety': {
        const color = random(['red','green','yellow']);
        let correct = 'Wait';
        if(color === 'red') correct = 'Stop';
        if(color === 'green') correct = 'Go';
        const pool = distractors.safety[dp] || distractors.safety.easy;
        options = buildOptions(correct, pool, opts);
        questionText = fillTemplate(questionText, {color});
        meta = {category:'safety', color};
        break;
      }

      case 'routine': {
        const morningActivities = ['brush teeth','eat breakfast','put on shoes','wash face','comb hair'];
        const correct = random(morningActivities);
        const pool = distractors.routine ? distractors.routine[dp] : distractors.routine.easy;
        options = buildOptions(correct, pool, opts);
        meta = {category:'routine', activity: correct};
        break;
      }

      case 'object_ident': {
        const purposes = {
          eating: ['spoon','fork','knife'],
          cutting: ['scissors','knife','cutter'],
          drinking: ['cup','glass','mug'],
          writing: ['pencil','pen','marker']
        };
        const keys = Object.keys(purposes);
        const purpose = random(keys);
        const correct = random(purposes[purpose]);
        const pool = (distractors.object && distractors.object[dp]) ? distractors.object[dp] : distractors.object.easy;
        options = buildOptions(correct, pool.concat(Object.values(purposes).flat()), opts);
        questionText = fillTemplate(questionText, {purpose});
        meta = {category:'object_ident', purpose, correct};
        break;
      }

      case 'counting': {
        const items = ['apple','ball','star','flower','cookie'];
        const item = random(items);
        let correctCount;
        if(level === 'easy') correctCount = random([1,2,3]);
        else if(level === 'medium') correctCount = random([3,4,5]);
        else correctCount = random([4,5,6]);
        const poolVals = [correctCount, Math.max(1, correctCount-1), correctCount+1, correctCount+2];
        const answers = shuffle(poolVals).slice(0, opts).map(v => ({text: String(v), correct: v === correctCount}));
        options = answers;
        questionText = fillTemplate(questionText, {item});
        meta = {category:'counting', item, correctCount};
        break;
      }

      case 'sequence': {
        const activities = [
          {activity:'wake up', seq:['open eyes','brush teeth','get dressed']},
          {activity:'eat breakfast', seq:['sit at table','eat','wash hands']},
          {activity:'go to school', seq:['pack bag','wear shoes','leave house']}
        ];
        const pair = random(activities);
        const correct = pair.seq[0];
        const wrongs = pickN(pair.seq.slice(1).concat(['sing','play']), opts-1);
        options = shuffle([{text:correct, correct:true}, ...wrongs.map(w=>({text:w, correct:false}))]);
        questionText = fillTemplate(questionText, {activity: pair.activity});
        meta = {category:'sequence', activity: pair.activity};
        break;
      }

      case 'odd_one': {
        const group = [
          ['dog','cat','spoon'],
          ['apple','banana','car'],
          ['shirt','pants','truck']
        ];
        const trio = random(group);
        const correct = trio.find(x => ['spoon','car','truck'].includes(x));
        options = shuffle(trio.map(t => ({text:t, correct:t===correct})));
        questionText = fillTemplate(questionText, {a:trio[0], b:trio[1], c:trio[2]});
        meta = {category:'odd_one'};
        break;
      }

      case 'emotion_matching': {
        const acts = [
          {action:'smiling', emotion:'happy'},
          {action:'crying', emotion:'sad'},
          {action:'shouting', emotion:'angry'},
          {action:'clapping', emotion:'excited'}
        ];
        const pair = random(acts);
        const pool = distractors.emotion[dp] || distractors.emotion.easy;
        options = buildOptions(pair.emotion, pool, opts);
        questionText = fillTemplate(questionText, {emotion_action: pair.action});
        meta = {category:'emotion_matching', emotion:pair.emotion};
        break;
      }

      case 'response_choice': {
        const pairs = [
          {utter:'Can I play?', reply:'Yes, let\'s play'},
          {utter:'Thank you', reply:'You\'re welcome'},
          {utter:'I am sorry', reply:'It\'s okay'}
        ];
        const pair = random(pairs);
        const pool = [pair.reply, 'Ignore', 'Say nothing', 'Laugh'];
        options = buildOptions(pair.reply, pool, opts);
        questionText = fillTemplate(questionText, {utterance: pair.utter});
        meta = {category:'response_choice'};
        break;
      }

      case 'polite_request': {
        const correct = 'Please may I have a pencil?';
        const pool = ['Give me pencil','Please may I have a pencil?','I want pencil'];
        options = buildOptions(correct, pool, opts);
        meta = {category:'polite_request'};
        break;
      }

      case 'indoor_outdoor': {
        const places = ['indoor','outdoor'];
        const place = random(places);
        const correct = place === 'indoor' ? random(['reading','drawing','watching tv']) : random(['running','playing','gardening']);
        const pool = (distractors.places && distractors.places[dp]) ? distractors.places[dp] : distractors.places.easy;
        const wrongs = pickN(pool, opts-1);
        options = shuffle([{text: correct, correct:true}, ...wrongs.map(w=>({text:w, correct:false}))]);
        questionText = fillTemplate(questionText, {place});
        meta = {category:'indoor_outdoor', place};
        break;
      }

      case 'pronoun_check': {
        const wrong = "I goed home";
        const corr = "I went home";
        options = shuffle([{text:wrong, correct:false},{text:corr, correct:true}]);
        if(opts > 2){
          options.push({text:'I go home', correct:false});
          options = shuffle(options);
        }
        questionText = fillTemplate(questionText, {wrong: wrong, correct: corr});
        meta = {category:'pronoun_check'};
        break;
      }

      case 'health': {
        const correct = 'Tell a teacher or rest';
        const pool = ['Tell a teacher or rest','Keep playing','Hide in corner'];
        options = buildOptions(correct, pool, opts);
        meta = {category:'health'};
        break;
      }

      case 'object_category': {
        const cats = Object.keys(categorySamples);
        const cat = random(cats);
        const correct = random(categorySamples[cat]);
        const pool = distractors.object ? distractors.object[dp] : distractors.object.easy;
        options = buildOptions(correct, pool.concat(categorySamples[cat]), opts);
        questionText = fillTemplate(questionText, {category: cat});
        meta = {category:'object_category', objectCategory:cat};
        break;
      }

      case 'emotion_cause': {
        const ev = [
          {emotion:'happy', cause:'someone shared a toy'},
          {emotion:'sad', cause:'they lost their toy'},
          {emotion:'scared', cause:'loud noise'},
          {emotion:'angry', cause:'someone pushed them'}
        ];
        const pair = random(ev);
        const pool = distractors.emotion[dp];
        options = buildOptions(pair.emotion, pool, opts);
        questionText = fillTemplate(questionText, {emotion: pair.emotion});
        meta = {category:'emotion_cause', cause: pair.cause};
        break;
      }

      case 'follow_rule': {
        const correct = 'Listen quietly';
        const pool = ['Listen quietly','Shout loudly','Play with toys'];
        options = buildOptions(correct, pool, opts);
        meta = {category:'follow_rule'};
        break;
      }

      default: {
        const correct = 'Yes';
        const pool = ['Yes','No','Maybe'];
        options = buildOptions(correct, pool, Math.max(3, opts));
        meta = {category:'generic'};
      }
    }

    if(options.length < params.opts){
      const addCount = params.opts - options.length;
      for(let i=0;i<addCount;i++){
        options.push({text:`Option ${i+1}`, correct:false});
      }
      options = shuffle(options);
    }

    return {
      id: `gen_${Date.now()}_${Math.floor(Math.random()*10000)}`,
      templateId: tpl.id,
      text: questionText,
      options: options.map((o, idx) => ({ id:`o${idx+1}`, text: o.text, correct: !!o.correct })),
      difficulty_value: score,
      meta: meta
    };
  }

  function generateQuestion(templateId, score=0.5, recentIds=new Set()){
    const tpl = templates.find(t => t.id === templateId);
    if(!tpl){
      return generateRandomQuestion(score, recentIds);
    }
    const params = difficultyToParams(score);
    params.difficultyScore = score;

    let tries = 0;
    let currentTpl = tpl;
    while(recentIds && recentIds.has(`${currentTpl.id}`) && tries < 5){
      const sameType = templates.filter(t => t.type === currentTpl.type && !recentIds.has(`${t.id}`));
      if(sameType.length > 0) currentTpl = random(sameType);
      else break;
      tries++;
    }

    return generateFromTemplateObj(currentTpl, params);
  }

  function generateRandomQuestion(score=0.5, recentIds=new Set()){
    const candidates = templates.filter(t => !(recentIds && recentIds.has(t.id)));
    const tpl = candidates.length ? random(candidates) : random(templates);
    return generateQuestion(tpl.id, score, recentIds);
  }

  global.generateQuestion = generateQuestion;
  global.generateRandomQuestion = generateRandomQuestion;

})(window);
