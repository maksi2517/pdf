/* Netzwerktechnik – Übungsquiz
 * Anforderungen:
 * - Fragen-Reihenfolge zufällig
 * - Reihenfolge der Antwortmöglichkeiten zufällig
 * - Nach jeder beantworteten Frage: unten richtige Antwort(en) anzeigen
 * - Single-Choice vs. Multiple-Choice wird automatisch erkannt
 */

const QUESTIONS = [
    {
        q: "Ein leitungsvermittelndes Kommunikationsnetz hat folgende Eigenschaften.",
        answers: [
            { t: "In der Regel konstante Bandbreite.", ok: true },
            { t: "Datenkanal wird gemeinsam für mehrere Kommunikationsvorgänge verwendet.", ok: false },
            { t: "In der Regel variable Bandbreite.", ok: false },
            { t: "Datenkanal wird exklusiv für einen Kommunikationsvorgang verwendet.", ok: true },
        ],
    },
    {
        q: "Welche Aussagen treffen auf das SMTP Protokoll zu?",
        answers: [
            { t: "SMTP gehört zu den binären Protokollen.", ok: false },
            { t: "SMTP wird zum Verschicken von Mails verwendet.", ok: true },
            { t: "SMTP wird zum Abruf von Mails von einem Mailserver verwendet.", ok: false },
            { t: "SMTP folgt dem Client-Server Modell.", ok: true },
        ],
    },
    {
        q: "Was sind die Aufgaben der Transportschicht?",
        answers: [
            { t: "Es findet immer eine Fehlererkennung und Flusskontolle statt.", ok: false },
            { t: "Datenpakete werden über mehrere Zwischenstationen von der Quelle ans Ziel transportiert.", ok: false },
            { t: "Daten werden geordnet zwischen zwei Anwendungen ausgetauscht.", ok: true },
            { t: "Eine Fehlererkennung und Flusskontolle wird optional angeboten.", ok: true },
        ],
    },
    {
        q: "Welche Aussagen treffen auf Firewalls zu?",
        answers: [
            { t: "Eine Firewall befolgt das Ende-zu-Ende Prinzip.", ok: false },
            { t: "Eine Firewall ist auf den Layern 3 und 4 angesiedelt.", ok: true },
            { t: "Eine Firewall ist auf den Layern 2 und 3 angesiedelt.", ok: false },
            { t: "Eine Firewall ist ein Router, der anhand vorgegebenen Regeln Datenpakete filtert.", ok: true },
        ],
    },
    {
        q: "Ein leitungsvermittelndes Kommunikationsnetz hat folgende Eigenschaften:",
        answers: [
            { t: "Zeitintensiver Verbindungsaufbau notwendig", ok: true },
            { t: "Schwankende Latenz", ok: false },
            { t: "Kein Verbindungsaufbau notwendig", ok: false },
            { t: "Konstante und niedrige Latenz", ok: true },
        ],
    },
    {
        q: "Was versteht man unter Broadcast?",
        answers: [
            { t: "Adressiert eine Gruppe von mehreren Empfängern. (→ Multicast)", ok: false },
            { t: "Adressiert den nächsten passenden Netzknoten. (→ Anycast)", ok: false },
            { t: "Adressiert einen einzelnen Empfänger. (→ Unicast)", ok: false },
            { t: "Adressiert alle Geräte (eines Teilnetzes). (z. B. 255.255.255.255)", ok: true },
        ],
    },
    {
        q: "Welche Informationen werden für die eindeutige Identifikation einer TCP-Verbindung benötigt?",
        answers: [
            { t: "Portnummer des Empfängers", ok: true },
            { t: "IP-Adresse des Empfängers", ok: true },
            { t: "Portnummer des Senders", ok: true },
            { t: "IP-Adresse des Senders", ok: true },
        ],
    },
    {
        q: "Unter Flow-Control (Flusssteuerung) versteht man …",
        answers: [
            { t: "Maßnahmen, die verhindern, dass der Empfänger Pakete aufgrund von vollen Empfangsbuffer verwerfen muss.", ok: true },
            { t: "Maßnahmen, die die Rekonstruktion der richtigen Reihenfolge von Paketen sicherstellen können.", ok: false },
            { t: "Maßnahmen, die verhindern, dass es zu einem Stau im Übertragungsnetzwerk kommt.", ok: false },
            { t: "Maßnahmen, die die Übertragung von Paketen beschleunigen können.", ok: false },
        ],
    },
    {
        q: "Was sind die Aufgaben der Vermittlungsschicht?",
        answers: [
            { t: "Sitzungsparameter werden zwischen zwei Kommunikationspartner vermittelt.", ok: false },
            { t: "Es wird ein verbindungsorientierter Datentransport angeboten.", ok: false },
            { t: "Sie bietet Fehlerkorrektur und Flusskontrolle beim Datentransport über mehrere Zwischenknoten an.", ok: false },
            { t: "Datenpakete werden über mehrere Zwischenstationen von der Quelle ans Ziel transportiert.", ok: true },
        ],
    },
    {
        q: "Auf was müssen Sie bei der Entwicklung von eigenen Anwendungsprotokollen achten?",
        answers: [
            { t: "Auf einfache Erweiterbarkeit und Abwärtskompatibilität ist zu achten.", ok: true },
            { t: "Die Kompatibilität mit anderen Anwendungsprotokollen ist auf alle Fälle einzuhalten.", ok: false },
            { t: "Nur Eigenentwicklungen verwenden, da andere Frameworks und Libraries fehlerbehaftet sein können.", ok: false },
            { t: "Das Nachrichtenformat muss wohldefiniert und eindeutig sein.", ok: true },
        ],
    },
    {
        q: "Was sind die Aufgaben der Darstellungsschicht?",
        answers: [
            { t: "Daten werden in mehrere Darstellungsformen umgewandelt und dann übertragen.", ok: false },
            { t: "Es wird ein syntaktisch korrekter Datenaustausch sichergestellt.", ok: true },
            { t: "Daten werden verschlüsselt übertragen.", ok: true },
            { t: "Die Darstellung von Daten wird auf Fehler überprüft.", ok: false },
        ],
    },
    {
        q: "Welche der folgenden Aussagen ist richtig?",
        answers: [
            { t: "Das Internet besteht nur aus E-Mail-Servern und Webseiten.", ok: false },
            { t: "Das Internet wird ausschließlich von den USA verwaltet.", ok: false },
            { t: "Das Internet ist ein Zusammenschluss vieler unabhängiger Teilnetze.", ok: true },
            { t: "Das Internet wird überstaatlich verwaltet.", ok: false },
        ],
    },
    {
        q: "Wieso gibt es bei WLAN eine so große Diskrepanz zwischen Brutto- und Netto-Datenrate?",
        answers: [
            { t: "Weil die Layer-2-Header bei WLAN so groß sind, dass sie einen großen Teil der Bandbreite belegen.", ok: false },
            { t: "Es kommt immer zu sehr vielen Kollisionen, weshalb Datenpakete ständig neu übertragen werden müssen.", ok: false },
            { t: "Um Kollisionen zu vermeiden, wird vor dem Senden eine Zeitlang gewartet (CSMA/CA, Backoff).", ok: true },
            { t: "Bevor gesendet wird, kann per RTS/CTS eine Sendeerlaubnis eingeholt und die Freigabe abgewartet werden.", ok: true },
        ],
    },
    {
        q: "Welche Aussagen treffen auf den TCP-Verbindungsaufbau zu?",
        answers: [
            { t: "Über den Handshake teilen sich die Kommunikationspartner die Startwerte ihrer Sequenznummern mit.", ok: true },
            { t: "Im letzten Paket des Handshakes dürfen schon Nutzdaten transportiert werden.", ok: true },
            { t: "Für den Verbindungsaufbau wird ein 2-Wege Handshake verwendet.", ok: false },
            { t: "Für den Verbindungsaufbau wird ein 3-Wege Handshake verwendet.", ok: true },
        ],
    },
    {
        q: "Ein paketvermittelndes Kommunikationsnetz hat folgende Eigenschaften.",
        answers: [
            { t: "Datenkanal wird exklusiv für einen Kommunikationsvorgang verwendet.", ok: false },
            { t: "In der Regel variable Bandbreite.", ok: true },
            { t: "Datenkanal wird gemeinsam für mehrere Kommunikationsvorgänge verwendet.", ok: true },
            { t: "In der Regel konstante Bandbreite.", ok: false },
        ],
    },
    {
        q: "Was sind die Aufgaben der Sitzungsschicht?",
        answers: [
            { t: "Es wird eine Fehlererkennung und -korrektur angeboten.", ok: false },
            { t: "Nachrichten werden einer Sitzung zugeordnet.", ok: true },
            { t: "Es wird ein zuverlässiger Datentransport zwischen zwei Anwendungen angeboten.", ok: false },
            { t: "Logische Verbindungen werden verwaltet.", ok: true },
        ],
    },
    {
        q: "Was sind die Aufgaben der Anwendungsschicht?",
        answers: [
            { t: "Datenpakete werden über mehrere Zwischenstationen von der Quelle ans Ziel transportiert.", ok: false },
            { t: "Es wird ein Protokoll einer spezifischen Anwendung implementiert.", ok: true },
            { t: "Es wird eine zuverlässige Übertragung von Datenpaketen über einen Kommunikationskanal realisiert.", ok: false },
            { t: "Es wird ein zuverlässiger Datentransport zwischen zwei Anwendungen angeboten.", ok: false },
        ],
    },
    {
        q: "Ein Port …",
        answers: [
            { t: "dient dem Datenaustausch zwischen Programmen.", ok: true },
            { t: "dient der eindeutigen Identifikation von Sockets.", ok: false },
            { t: "ist ein Teil einer Netzwerkadresse auf der Vermittlungsschicht.", ok: false },
            { t: "ist eine 32-bit Zahl.", ok: false },
        ],
    },
    {
        q: "Welche Aussagen treffen auf TCP Sequenznummern zu?",
        answers: [
            { t: "Sequenznummern starten immer bei 0.", ok: false },
            { t: "Sequenznummern werden für die lückenlos aufsteigende Nummerierung der einzelnen TCP-Pakete (genauer: Bytes im Datenstrom) verwendet.", ok: true },
            { t: "Für die Speicherung der Sequenznummer im TCP-Header wird eine 32-bit Zahl verwendet.", ok: true },
            { t: "Sequenznummern können einen beliebigen Startwert haben (ISN wird i. d. R. zufällig gewählt).", ok: true },
        ],
    },
    {
        q: "Was sind die Aufgaben der Sicherungsschicht?",
        answers: [
            { t: "Der gleichzeitige Zugriff von mehreren Kommunikationspartnern auf ein Übertragungsmedium wird geregelt.", ok: true },
            { t: "Es wird eine zuverlässige Übertragung von Datenpaketen über einen Kommunikationskanal realisiert.", ok: true },
            { t: "Es wird ein sicherer Transport von Datenpaketen über mehrere Zwischenstationen angeboten.", ok: false },
            { t: "Daten werden verschlüsselt übertragen.", ok: false },
        ],
    },
    {
        q: "Welche Aussagen treffen auf das Schichtenmodell zu?",
        answers: [
            { t: "Beim Senden durchwandert ein Paket alle Schichten von unten nach oben.", ok: false },
            { t: "Beim Empfangen durchwandert ein Paket alle Schichten von oben nach unten.", ok: false },
            { t: "Beim Empfangen durchwandert ein Paket alle Schichten von unten nach oben.", ok: true },
            { t: "Beim Senden durchwandert ein Paket alle Schichten von oben nach unten.", ok: true },
        ],
    },
    {
        q: "Das Transmission Control Protocol (TCP) hat folgende Eigenschaften:",
        answers: [
            { t: "zuverlässig", ok: true },
            { t: "verbindungslos", ok: false },
            { t: "verbindungsorientiert", ok: true },
            { t: "unzuverlässig", ok: false },
        ],
    },
    {
        q: "Welche Aussagen treffen auf ASCII-Protokolle zu?",
        answers: [
            { t: "ASCII-Protokolle verwenden nur vom Menschen lesbare Zeichen und Wörter.", ok: false },
            { t: "Der Hauptgrund ist nicht, dass „der Server leichter dekodiert“, sondern Lesbarkeit/Debugbarkeit & Interoperabilität.", ok: false },
            { t: "ASCII-Protokolle sind nicht schlank – Text ist meist größer/geschwätziger als Binär.", ok: false },
            { t: "Die übertragene Datenmenge ist in der Regel größer als bei binären Protokollen.", ok: true },
        ],
    },
    {
        q: "Welche zwei grundlegenden Arten von Kommunikationsnetzen kennen Sie?",
        answers: [
            { t: "Datenvermittlung", ok: false },
            { t: "Paketvermittlung", ok: true },
            { t: "Flussvermittlung", ok: false },
            { t: "Leitungsvermittlung", ok: true },
        ],
    },
    {
        q: "Was bedeutet der Begriff Transit im Zusammenhang mit dem Internet?",
        answers: [
            { t: "Ein Netzwerkbetreiber bezahlt einen anderen für das Durchleiten von Daten.", ok: true },
            { t: "Gemeinsamer Datenaustausch zwischen zwei gleichberechtigten Partnern.", ok: false },
            { t: "Sensible Datenpakete werden für ihren Weg durch das Internet verschlüsselt.", ok: false },
            { t: "Sensible Datenpakete werden über spezielle Leitungen transportiert.", ok: false },
        ],
    },
    {
        q: "Was versteht man unter dem Begriff Latenz?",
        answers: [
            { t: "Die Anzahl der Dateneinheiten pro Zeitspanne, die über eine Datenverbindung transportiert werden.", ok: false },
            { t: "Die Zeit vom Versenden der Daten bis zum Ankommen beim Empfänger.", ok: true },
            { t: "Den Durchmesser eines Netzwerkkabels.", ok: false },
            { t: "Die Zeit, die ein Paket vom Sender zum Empfänger und wieder zurück braucht.", ok: false },
        ],
    },
    {
        q: "Welche Aussagen treffen auf das ISO/OSI-Schichtenmodell zu?",
        answers: [
            { t: "Jede Schicht baut auf den Services der unteren Schicht auf.", ok: true },
            { t: "Jede Schicht bietet ihre Services den unteren Schichten an.", ok: false },
            { t: "Mehrere Aufgaben werden in einer Schicht gebündelt.", ok: true },
            { t: "Jede Schicht erfüllt genau eine Aufgabe.", ok: false },
        ],
    },
    {
        q: "Auf was müssen Sie bei der Entwicklung von eigenen Anwendungsprotokollen achten? (Variante 2)",
        answers: [
            { t: "Die Kompatibilität mit anderen Anwendungsprotokollen ist auf alle Fälle einzuhalten.", ok: false },
            { t: "Das Nachrichtenformat muss wohldefiniert und eindeutig sein.", ok: true },
            { t: "Nur Eigenentwicklungen verwenden, da andere Frameworks und Libraries fehlerbehaftet sein können.", ok: false },
            { t: "Auf einfache Erweiterbarkeit und Abwärtskompatibilität ist zu achten.", ok: true },
        ],
    },
    {
        q: "Was versteht man unter Multicast?",
        answers: [
            { t: "Adressiert den nächsten passenden Netzknoten.", ok: false },
            { t: "Adressiert eine Gruppe von mehreren Empfängern.", ok: true },
            { t: "Adressiert einen einzelnen Empfänger.", ok: false },
            { t: "Adressiert alle Geräte (eines Teilnetzes).", ok: false },
        ],
    },
    {
        q: "Welche Aussagen treffen auf das DNS-System zu?",
        answers: [
            { t: "Man unterscheidet zwischen rekursiver und iterativer Namensauflösung.", ok: true },
            { t: "Domainnamen sind hierarchisch in einer Baumstruktur gegliedert.", ok: true },
            { t: "Der gesamte DNS-Adressraum ist in überlappende Zonen eingeteilt.", ok: false },
            { t: "DNS wird ausschließlich für Name→IP verwendet.", ok: false },
        ],
    },
    {
        q: "Das User Datagram Protocol (UDP) hat folgende Eigenschaften:",
        answers: [
            { t: "zuverlässig", ok: false },
            { t: "verbindungsorientiert", ok: false },
            { t: "unzuverlässig", ok: true },
            { t: "verbindungslos", ok: true },
        ],
    },
    {
        q: "Wie wird Staukontrolle im User Datagram Protocol (UDP) umgesetzt?",
        answers: [
            { t: "Durch ein Go-Back-N Verfahren.", ok: false },
            { t: "Mithilfe von Sequenznummern.", ok: false },
            { t: "Gar nicht – UDP hat keine eingebaute Staukontrolle.", ok: true },
            { t: "Mithilfe eines Sliding Window.", ok: false },
        ],
    },
    {
        q: "Ein leitungsvermittelndes Kommunikationsnetz hat folgende Eigenschaften. (Variante 2)",
        answers: [
            { t: "In der Regel variable Bandbreite.", ok: false },
            { t: "Datenkanal wird gemeinsam für mehrere Kommunikationsvorgänge verwendet.", ok: false },
            { t: "Datenkanal wird exklusiv für einen Kommunikationsvorgang verwendet.", ok: true },
            { t: "In der Regel konstante Bandbreite.", ok: true },
        ],
    },
];

// ---------- Hilfsfunktionen ----------
function shuffleInPlace(arr){
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// ---------- Quiz-Logik ----------
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const progressEl = document.getElementById('progress');
const restartBtn = document.getElementById('restartBtn');

let state = {
    order: [],
    idx: 0,
    score: 0,
};

restartBtn.addEventListener('click', start);

function start(){
    state.order = shuffleInPlace(deepClone(QUESTIONS));
    state.idx = 0;
    state.score = 0;
    resultCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    renderCurrent();
}

function renderCurrent(){
    const total = state.order.length;
    if(state.idx >= total){
        showSummary();
        return;
    }

    const qObj = deepClone(state.order[state.idx]);
    shuffleInPlace(qObj.answers);

    const numCorrect = qObj.answers.filter(a => a.ok).length;
    const isMulti = numCorrect > 1;

    progressEl.textContent = `Frage ${state.idx + 1} / ${total}`;

    quizCard.innerHTML = `
    <p class="badge">${isMulti ? "Mehrfachauswahl möglich – wähle alle zutreffenden Antworten" : "Einzelauswahl – wähle eine Antwort"}</p>
    <h2 class="question">${escapeHTML(qObj.q)}</h2>
    <form id="optionsForm" class="options" autocomplete="off"></form>
    <div class="actions">
      <button id="checkBtn" class="btn" disabled>Antwort prüfen</button>
      <button id="skipBtn" class="btn btn--secondary" title="Frage überspringen (zählt nicht zur Punktzahl)">Überspringen</button>
    </div>
    <div id="feedback" class="feedback hidden" role="status" aria-live="polite"></div>
  `;

    const form = $('#optionsForm', quizCard);
    qObj.answers.forEach((ans, idx) => {
        const id = `opt-${state.idx}-${idx}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'option';
        wrapper.innerHTML = `
      <input id="${id}" name="q${state.idx}" type="${isMulti ? 'checkbox' : 'radio'}" value="${idx}">
      <label for="${id}">${escapeHTML(ans.t)}</label>
    `;
        form.appendChild(wrapper);
    });

    const checkBtn = $('#checkBtn', quizCard);
    const skipBtn = $('#skipBtn', quizCard);
    const feedback = $('#feedback', quizCard);

    form.addEventListener('change', () => {
        const anyChecked = $all('input:checked', form).length > 0;
        checkBtn.disabled = !anyChecked;
    });

    checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Auswertung
        const selectedIdx = $all('input:checked', form).map(i => Number(i.value));
        const correctIdx = qObj.answers.map((a, i) => a.ok ? i : -1).filter(i => i >= 0);

        const isExactlyCorrect = sameSet(selectedIdx, correctIdx);

        // Markieren
        qObj.answers.forEach((ans, i) => {
            const el = form.children[i];
            if (selectedIdx.includes(i) && ans.ok) el.classList.add('correct');
            if (selectedIdx.includes(i) && !ans.ok) el.classList.add('wrong');
            if (!selectedIdx.includes(i) && ans.ok) el.classList.add('correct');
            // Inputs deaktivieren
            el.querySelector('input').disabled = true;
        });

        // Feedback + richtige Antwort(en)
        feedback.classList.remove('hidden');
        feedback.classList.toggle('ok', isExactlyCorrect);
        feedback.classList.toggle('bad', !isExactlyCorrect);
        feedback.innerHTML = `
      <p class="status">${isExactlyCorrect ? "Richtig! 🎉" : "Nicht ganz. 🤔"}</p>
      <p class="kicker">Richtige Antwort${correctIdx.length>1 ? "en" : ""}:</p>
      <ul>${correctIdx.map(i => `<li>${escapeHTML(qObj.answers[i].t)}</li>`).join("")}</ul>
      <div class="actions">
        <button id="nextBtn" class="btn">${state.idx + 1 >= state.order.length ? "Ergebnis anzeigen" : "Nächste Frage"}</button>
      </div>
    `;

        // Punktzahl
        if (isExactlyCorrect) state.score++;

        // Buttons steuern
        checkBtn.disabled = true;
        skipBtn.disabled = true;

        $('#nextBtn', feedback).addEventListener('click', () => {
            state.idx++;
            renderCurrent();
        });
    });

    // Überspringen: zeigt trotzdem die Lösung (Anforderung: „Nach jeder beantworteten Frage“ – Skip zählt als beantwortet mit leerer Auswahl)
    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // simuliere leere Auswahl
        const feedback = $('#feedback', quizCard);
        const correctIdx = qObj.answers.map((a, i) => a.ok ? i : -1).filter(i => i >= 0);
        // Markiere nur richtige
        qObj.answers.forEach((ans, i) => {
            const el = form.children[i];
            if (ans.ok) el.classList.add('correct');
            el.querySelector('input').disabled = true;
        });

        feedback.classList.remove('hidden');
        feedback.classList.add('bad');
        feedback.innerHTML = `
      <p class="status">Übersprungen. 👀</p>
      <p class="kicker">Richtige Antwort${correctIdx.length>1 ? "en" : ""}:</p>
      <ul>${correctIdx.map(i => `<li>${escapeHTML(qObj.answers[i].t)}</li>`).join("")}</ul>
      <div class="actions">
        <button id="nextBtn" class="btn">${state.idx + 1 >= state.order.length ? "Ergebnis anzeigen" : "Nächste Frage"}</button>
      </div>
    `;
        checkBtn.disabled = true;
        skipBtn.disabled = true;
        $('#nextBtn', feedback).addEventListener('click', () => {
            state.idx++;
            renderCurrent();
        });
    });
}

function showSummary(){
    quizCard.classList.add('hidden');
    resultCard.classList.remove('hidden');
    progressEl.textContent = `Geschafft!`;

    const total = state.order.length;
    const pct = Math.round((state.score / total) * 100);

    resultCard.innerHTML = `
    <h2>Ergebnis</h2>
    <p class="score">Punktzahl: <strong>${state.score}</strong> von <strong>${total}</strong> (${pct}%)</p>
    <div class="actions" style="margin-top:12px;">
      <button class="btn" id="againBtn">🔁 Nochmal spielen</button>
      <button class="btn btn--secondary" id="reshuffleBtn">🔀 Neu mischen</button>
    </div>
  `;

    $('#againBtn', resultCard).addEventListener('click', () => {
        // gleicher Fragen-Seed, wieder bei 0 anfangen
        state.idx = 0;
        state.score = 0;
        resultCard.classList.add('hidden');
        quizCard.classList.remove('hidden');
        renderCurrent();
    });

    $('#reshuffleBtn', resultCard).addEventListener('click', start);
}

// ---------- Utilities ----------
function sameSet(a, b){
    if (a.length !== b.length) return false;
    const sa = [...a].sort((x,y)=>x-y);
    const sb = [...b].sort((x,y)=>x-y);
    for (let i=0;i<sa.length;i++) if (sa[i] !== sb[i]) return false;
    return true;
}

function escapeHTML(str){
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ---------- Autostart ----------
start();