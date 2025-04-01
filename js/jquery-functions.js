$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};

  // ------------ Πίνακες δεδομένων -------------
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;
  // --------------------------------------------

  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  // Φορτώνει το JSON με τις ελληνικές ερωτήσεις + τις αγγλικές
  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;

        // Φορτώνουμε και το δεύτερο (all-questions-en.json)
        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);

            // Εμφανίζει μήνυμα λάθους
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);

        // Εμφανίζει μήνυμα λάθους
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  // Φορτώνουμε τα evidences (cpsv.json / cpsv-en.json)
  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        // totalEvidences = data.length; // (αν το χρειάζεστε)

        // Μετά φορτώνουμε το cpsv-en.json
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);

            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);

        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  // Φορτώνει FAQs (faq.json + faq-en.json)
  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;

        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en.json:", error);
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq.json:", error);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

  // Παράδειγμα συνάρτησης, βρίσκει evidences by id (αν το χρειάζεστε)
  function getEvidencesById(id) {
    var selectedEvidence;
    currentLanguage === "greek"
      ? (selectedEvidence = all_evidences)
      : (selectedEvidence = all_evidences_en);

    selectedEvidence = selectedEvidence.PublicService.evidence.find(
      (evidence) => evidence.id === id
    );

    if (selectedEvidence) {
      const evidenceListElement = document.getElementById("evidences");
      selectedEvidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    } else {
      console.log(`Evidence with ID '${id}' not found.`);
    }
  }

  // Απλό helper, τοποθετεί κείμενο στην τελική σελίδα
  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  // Φορτώνει τις Συχνές Ερωτήσεις σε ένα container
  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
            ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  // Μετατρέπει τυχόν URLs σε clickable links
  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">myKEPlive</a>.'
    );
  }

  // ------------------ ΕΜΦΑΝΙΣΗ ΤΡΕΧΟΥΣΑΣ ΕΡΩΤΗΣΗΣ ------------------

  /**
   * Εμφανίζει την ερώτηση με συγκεκριμένο questionId.
   * @param {number} questionId Το id της ερώτησης
   * @param {boolean} noError true αν δεν θέλουμε ένδειξη λάθους (μη απάντησης)
   */
  function loadQuestion(questionId, noError) {
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    }

    // Επιλέγουμε το σωστό language
    var question;
    currentLanguage === "greek"
      ? (question = all_questions[questionId])
      : (question = all_questions_en[questionId]);

    // Αν δεν υπάρχει τέτοια ερώτηση, βάζουμε μήνυμα λάθους ή κρύβουμε τα btns
    if (!question) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Δεν βρέθηκε ερώτηση με id=" + questionId;
      $(".question-container").html(errorMessage);
      hideFormBtns();
      return;
    }

    // Δημιουργούμε δυναμικά HTML
    var questionElement = document.createElement("div");

    // (α) Κανονική εμφάνιση
    if (noError) {
      questionElement.innerHTML = `
        <div class='govgr-field'>
          <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
              ${question.question}
            </legend>
            <div class='govgr-radios' id='radios-${questionId}'>
              <ul>
                ${question.options
                  .map(
                    (option, index) => `
                      <div class='govgr-radios__item'>
                        <label class='govgr-label govgr-radios__label'>
                          ${option.text}
                          <input class='govgr-radios__input'
                                 type='radio'
                                 name='question-option'
                                 value='${index}' />
                        </label>
                      </div>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </fieldset>
        </div>
      `;
    }
    // (β) Εμφάνιση με λάθος (χρήστης δεν απάντησε)
    else {
      questionElement.innerHTML = `
        <div class='govgr-field govgr-field__error' id='$id-error'>
          <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
            ${question.question}
          </legend>
          <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
            <legend class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
              Επιλέξτε την απάντησή σας
            </legend>
            <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
            <div class='govgr-radios' id='radios-${questionId}'>
              <p class='govgr-error-message'>
                <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
              </p>

              ${question.options
                .map(
                  (option, index) => `
                    <div class='govgr-radios__item'>
                      <label class='govgr-label govgr-radios__label'>
                        ${option.text}
                        <input class='govgr-radios__input'
                               type='radio'
                               name='question-option'
                               value='${index}' />
                      </label>
                    </div>
                  `
                )
                .join("")}
            </div>
          </fieldset>
        </div>
      `;

      // Αν είστε σε αγγλικό περιβάλλον, ενημερώνετε manual τα κείμενα
      if (currentLanguage === "english") {
        var components = Array.from(
          questionElement.querySelectorAll(".language-component")
        );
        // Τελευταία 4 στοιχεία αλλάζουν
        components.slice(-4).forEach(function (component) {
          var componentName = component.dataset.component;
          component.textContent =
            languageContent[currentLanguage][componentName];
        });
      }
    }

    $(".question-container").html(questionElement);
  }

  // ------------- ΤΕΛΙΚΟ ΜΗΝΥΜΑ / ΥΠΟΒΟΛΗ -----------------

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν δικαιούστε το δελτίο μετακίνησης ΑΜΕΑ!"
        : "We are sorry but you are not entitled to the transportation card for the disabled!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  function retrieveAnswers() {
    var allAnswers = [];
    for (var i = 0; i < totalQuestions; i++) {
      var answerIndex = sessionStorage.getItem("answer_" + i);
      allAnswers.push(answerIndex);
    }

    // Παράδειγμα λογικής που φορτώνει evidences κ.λπ. 
    // (διατηρούμε ως δείγμα, εσείς το προσαρμόζετε στο θέμα σας)
    if (allAnswers[0] === "2") {
      getEvidencesById(9);
    }
    if (allAnswers[2] === "4") {
      getEvidencesById(11);
    }
    if (allAnswers[4] === "1") {
      getEvidencesById(6);
    } else if (allAnswers[4] === "2") {
      getEvidencesById(7);
    } else if (allAnswers[4] === "3") {
      getEvidencesById(8);
    }
    // ... κλπ., τμήμα δικής σας λογικής
  }

  function submitForm() {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek" ? "Είστε δικαιούχος!" : "You are eligible!";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);

    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά που πρέπει να προσκομίσετε για να λάβετε το δελτίο μετακίνησης είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The documents you need to provide in order to receive your transportation card are the following:</h5><br />"
        );
    $(".question-container").append(evidenceListElement);

    // Στη συνέχεια φορτώνουμε FAQs αν θέλουμε
    $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  // ------------------- ΣΥΜΠΕΡΙΦΟΡΑ ΚΟΥΜΠΙΩΝ -------------------

  // Όταν ο χρήστης πατά το κουμπί "Επόμενο"
  $("#nextQuestion").click(function () {
    // Ελέγχουμε αν επιλέχθηκε κάποια απάντηση (radio)
    if ($(".govgr-radios__input").is(":checked")) {
      // Παίρνουμε το index (value) της απάντησης
      var selectedRadioButtonIndex =
        $('input[name="question-option"]').index(
          $('input[name="question-option"]:checked')
        ) + 1;

      // Στο δικό μας JSON, η value είναι (index), οπότε:
      // π.χ. αν ο χρήστης διάλεξε τη 2η επιλογή, το selectedRadioButtonIndex = 2
      // Αλλάζει ελάχιστα η λογική των skipToEnd, αναλόγως...
      var question;
      currentLanguage === "greek"
        ? (question = all_questions[currentQuestion])
        : (question = all_questions_en[currentQuestion]);

      // Παίρνουμε το πραγματικό option object
      // το +1 συμβαίνει επειδή πιο πάνω κάναμε ".index(...) + 1"
      // Αν δεν θέλετε off-by-one, προσαρμόστε ανάλογα
      var actualOption = question.options[selectedRadioButtonIndex - 1];

      // Αποθηκεύουμε στο sessionStorage (για παράδειγμα)
      sessionStorage.setItem(
        "answer_" + currentQuestion,
        (selectedRadioButtonIndex - 1).toString()
      );
      userAnswers[currentQuestion] = selectedRadioButtonIndex - 1;

      // ------------------- Ελέγχουμε αν έχει 'message' ---------------------
      if (actualOption.message && actualOption.message.trim() !== "") {
        // Εμφανίζουμε αυτό το μήνυμα σε κάποιο DIV ή alert
        // Εδώ επιλέγουμε π.χ. .question-container, *πριν* προχωρήσουμε
        var msgElement = document.createElement("div");
        msgElement.className = "govgr-message";
        msgElement.innerHTML =
          "<p>" + actualOption.message.replace(/\n/g, "<br/>") + "</p>";
        $(".question-container").append(msgElement);
      }

      // ------------------- Ελέγχουμε αν έχει goto --------------------------
      // Αν έχει, αλλάζουμε τον currentQuestion = goto
      // Διαφορετικά, πάμε linear (currentQuestion++)
      if (actualOption.goto !== null && actualOption.goto !== undefined) {
        currentQuestion = actualOption.goto;
      } else {
        // Διατηρούμε την παλιά λογική: +1
        currentQuestion++;
      }

      // ----------------- Δείγμα skipToEnd (αν ταιριάζει στη λογική σας) --------------
      // Αν π.χ. θες να τερματίσεις τη ροή με βάση κάποια επιλογή
      // π.χ. currentQuestion === 0 και ο χρήστης διάλεξε 2η επιλογή, κτλ.
      // Διατηρώ ως παράδειγμα αυτό που υπήρχε:
      if (
        currentQuestion === -1 // αν είχατε στο προηγούμενο code τέτοιο σενάριο
      ) {
        skipToEnd("… κάποιο μήνυμα…");
        return;
      }

      // ----------------- Έλεγχος: τελείωσαν οι ερωτήσεις; -----------------
      if (currentQuestion >= totalQuestions) {
        submitForm();
      } else {
        loadQuestion(currentQuestion, true);

        // Αν είμαστε στην τελευταία ερώτηση (δηλ. currentQuestion === totalQuestions-1),
        // αλλάζουμε το κουμπί σε "Υποβολή"
        if (currentQuestion + 1 === totalQuestions) {
          currentLanguage === "greek"
            ? $(this).text("Υποβολή")
            : $(this).text("Submit");
        }
      }
    } else {
      // Αν δεν έχει επιλεγεί τίποτα, εμφανίζουμε "error" (noError=false)
      loadQuestion(currentQuestion, false);
    }
  });

  // Όταν ο χρήστης πατά "Πίσω"
  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      // Επαναφέρουμε την απάντηση που είχε ίσως αποθηκευτεί
      var storedIndex = sessionStorage.getItem("answer_" + currentQuestion);
      if (storedIndex) {
        var radioInputs = $('input[name="question-option"]');
        // 'storedIndex' είναι string "0" ή "1", κτλ.
        radioInputs.eq(parseInt(storedIndex)).prop("checked", true);
      }
    }
  });

  // Αλλαγή γλώσσας
  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    if (currentQuestion >= 0 && currentQuestion < totalQuestions) {
      loadQuestion(currentQuestion, true);
    }
  });

  // Στην αρχή, κρύβουμε τα κουμπιά ερωτήσεων
  $("#questions-btns").hide();

  // Κουμπί "Έναρξη" -> εμφανίζει τα btns, κρύβει το intro...
  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  // Φόρτωση όλων των δεδομένων (questions, evidences, faq)
  getQuestions().then(() => {
    getEvidences().then(() => {
      getFaq().then(() => {
        // Αφού έχουν φορτωθεί όλα, φορτώνουμε τις FAQs & την πρώτη ερώτηση
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
