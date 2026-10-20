const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const test = require("node:test");

const html = readFileSync(`${__dirname}/index.html`, "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const readFunction = name => {
  const start = script.indexOf(`      function ${name}(`);
  assert.notEqual(start, -1, `Funktion ${name} vorhanden`);
  return script.slice(start, script.indexOf("\n      }", start) + 8);
};
const settingsSource = readFunction("createMiniLab");
const settings = new Function(`return ${settingsSource.slice(
  settingsSource.indexOf("const settings = ") + "const settings = ".length,
  settingsSource.indexOf("\n        };") + 10
)}`)();
const taskSource = script.slice(script.indexOf("      const task = "), script.indexOf("\n      const topicSelect"));
const functions = ["gcd", "rational", "isCorrect", "isTaskCorrect", "expandTasks", "experimentMission",
  "orderLearningModel", "unitLearningModel", "experimentModel", "taskFractions",
  "lessonVisualModels", "taskVisualModels", "fractionVisualModels", "arithmeticVisualModels", "visualFigure", "visualStepCards"];
const api = new Function(`${taskSource}
  const numberFormat = new Intl.NumberFormat("de-DE");
  ${functions.map(readFunction).join("\n")}
  expandTasks();
  return {tasks, isCorrect, isTaskCorrect, experimentMission, orderLearningModel, experimentModel, taskFractions, lessonVisualModels, taskVisualModels};
`)();

test("Lernseite enthält gültiges JavaScript", () => {
  assert.doesNotThrow(() => new Function(script));
  const ids = [...html.split("<script>")[0].matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML-IDs sind eindeutig");
});

test("Alle Aufgaben haben vollständige Angaben, drei Tipps und eine akzeptierte Lösung", () => {
  assert.equal(api.tasks.length, 213);
  assert.equal(api.tasks.filter(task => !task.extra).length, 208);
  for (const task of api.tasks) {
    assert.ok(task.question.trim(), task.topic);
    assert.ok(task.explanation.trim(), task.question);
    assert.equal(task.tips.length, 3, task.question);
    assert.ok(task.tips.every(tip => tip.trim()), task.question);
    assert.ok(api.isTaskCorrect(task.answer, task), task.question);
    assert.ok(!api.isTaskCorrect("keine Zahl", task), task.question);
  }
});

test("Antwortprüfung unterscheidet Werte, gekürzte Brüche und offene Intervalle", () => {
  assert.ok(api.isCorrect("0,75", "3/4"));
  assert.ok(api.isCorrect("1 3/4", "7/4"));
  assert.ok(api.isCorrect("−0,5", "-1/2"));
  assert.ok(!api.isCorrect("6/8", "3/4", true));
  assert.ok(api.isCorrect("3/4", "3/4", true));
  for (const invalid of ["", "1/0", "0/0", "NaN", "0,7,5"]) assert.ok(!api.isCorrect(invalid, "0"));
  const interval = api.tasks.find(task => task.interval);
  assert.ok(api.isTaskCorrect("9/20", interval));
  for (const boundary of ["0,4", "0,5", "0,399999", "0,500001"]) assert.ok(!api.isTaskCorrect(boundary, interval));
  const fraction = api.tasks.find(task => task.question === "Berechne 5/6 − 1/3. Schreibe einen Bruch.");
  assert.ok(api.isTaskCorrect("1/2", fraction));
  assert.ok(api.isTaskCorrect("3/6", fraction));
  assert.ok(!api.isTaskCorrect("0,5", fraction));
});

test("Fehlerbeispiele erscheinen nicht als gegebene richtige Anteile im Aufgabenbild", () => {
  const item = api.tasks.find(task => task.question.includes("ist nicht 2/5"));
  assert.deepEqual(api.taskFractions(item), [[1, 2], [1, 3]]);
});

test("Aufgabenformulierung passt zur interaktiven Eingabe", () => {
  for (const task of api.tasks) {
    assert.ok(!/Unterstreiche|Was soll im Antwortfeld stehen|eine Zahl, ein Bruch oder ein Wort/i.test(task.question), task.question);
    assert.ok(task.question.trim().length >= 12, task.question);
    if (task.answerType === "text") assert.ok(/[A-Za-zIVXLCDM]/i.test(task.answer), task.question);
    else assert.ok(api.isTaskCorrect(task.answer, task), task.question);
  }
});

test("Explizite Grundrechenaufgaben stimmen mit ihrer Rechenoperation überein", () => {
  const operation = /^Berechne(?: schriftlich)?:?\s*([−-]?\d+(?:,\d+)?)\s*([+−·:])\s*(\d+(?:,\d+)?)\.$/;
  for (const task of api.tasks) {
    const match = task.question.match(operation);
    if (!match) continue;
    const left = Number(match[1].replace("−", "-").replace(",", "."));
    const right = Number(match[3].replace(",", "."));
    const result = match[2] === "+" ? left + right
      : match[2] === "−" ? left - right
        : match[2] === "·" ? left * right : left / right;
    const expected = Number.isInteger(result) ? String(result) : result.toLocaleString("en-US", {maximumFractionDigits: 10});
    assert.ok(api.isCorrect(task.answer, expected), `${task.question} -> ${task.answer} statt ${expected}`);
  }
});

test("Jeder Aufgaben- und Erklärungsbereich besitzt eine visuelle Lernhilfe", () => {
  for (const [kind, fields] of Object.entries(settings)) {
    const values = fields.map(([, min, , initial]) => Array.isArray(min) ? 0 : initial);
    assert.ok(api.experimentModel(kind, values).svg.trim(), `Keine Hauptgrafik für ${kind}`);
  }
  for (const task of api.tasks) {
    assert.ok(api.taskVisualModels(task).length > 0, `Keine Aufgabenhilfe für ${task.question}`);
  }
});

test("Jedes Thema bietet eine aufsteigende Übungsfolge", () => {
  const topics = new Map();
  for (const task of api.tasks.filter(task => !task.extra)) {
    if (!topics.has(task.topic)) topics.set(task.topic, new Set());
    topics.get(task.topic).add(task.level);
  }
  for (const [topic, levels] of topics) {
    assert.deepEqual([...levels].sort(), ["Knifflig", "Leicht", "Mittel"], topic);
  }
});

test("Punkt vor Strich und Klammern erzeugen die passenden Plättchenmengen", () => {
  for (let a = 1; a <= 12; a += 1) for (let b = 1; b <= 8; b += 1) for (let c = 1; c <= 8; c += 1) {
    const model = api.orderLearningModel(a, b, c);
    assert.equal((model.svg.match(/<circle /g) || []).length, a + b * c);
    assert.ok(model.svg.includes(`${a} + ${b} · ${c} = ${a + b * c}`));
    assert.ok(api.orderLearningModel(a, b, c, false).svg.includes(`${a} + ${b} · ${c} = ?`));
    assert.ok(!api.orderLearningModel(a, b, c, false).svg.includes(`= ${a + b * c}</text>`));
  }
});

test("Jede Reglerstation besitzt einen konkreten Auftrag und gültige Randzustände", () => {
  for (const [kind, fields] of Object.entries(settings)) {
    assert.equal(api.experimentMission(kind).length, 3, kind);
    assert.ok(api.experimentMission(kind).every(step => step.length > 25), kind);
    const initial = fields.map(([, min, max, value]) => Array.isArray(min) ? max : value);
    const cases = [initial];
    fields.forEach(([, min, max], index) => {
      for (const value of Array.isArray(min) ? min.map((_, i) => i) : [min, Math.floor((min + max) / 2), max]) {
        const values = [...initial]; values[index] = value; cases.push(values);
      }
    });
    for (const values of cases) {
      const model = api.experimentModel(kind, values);
      assert.ok(model.svg.trim(), `${kind}: ${values}`);
      assert.ok(model.caption.trim(), `${kind}: ${values}`);
      assert.ok(model.steps.length > 0 && model.steps.every(step => step.trim()), kind);
      assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(model)), `${kind}: ${values}`);
    }
  }
});

test("Gleiche Längeneinheiten sind in Rechteckbildern gleich groß", () => {
  const model = api.experimentModel("rectangle", [7, 3]);
  assert.ok(model.svg.includes('width="140" height="60" fill="none"'));
  const stepTwo = api.experimentModel("pattern", [2]);
  const stepFour = api.experimentModel("pattern", [4]);
  for (const tick of [0, 5, 10, 15, 20, 25]) {
    const label = `>${tick}</text>`;
    assert.ok(stepTwo.svg.includes(label));
    assert.ok(stepFour.svg.includes(label));
  }
});
