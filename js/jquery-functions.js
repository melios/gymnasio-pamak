$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  //hide the form buttons when its necessary
  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  //Once the form begins, the questions' data and length are fetched.
  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the evidences' data and length are fetched.
  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        totalEvidences = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the faqs' data is fetched.
  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        totalFaq = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en:", error);
            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq:", error);
        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

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
      console.log(`Evidence with ID '${givenEvidenceID}' not found.`);
    }
  }

  //text added in the final result
  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

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

  // get the url from faqs and link it
  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">myKEPlive</a>.'
    );
  }

  // get the url school map from faqs and link it
  function convertURLsToLinks(text) {
  return text.replace(
    /https:\/\/schoolmap\.gis\.minedu\.gov\.gr\/schoolmap/g,
    '<a href="$&" target="_blank">SchoolMap</a>.'
  );
}


  //Εachtime back/next buttons are pressed the form loads a question
  function loadQuestion(questionId, noError) {
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    }

    currentLanguage === "greek"
      ? (question = all_questions[questionId])
      : (question = all_questions_en[questionId]);
    var questionElement = document.createElement("div");

    if (noError) {
      // normal display
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
                          ${option}
                          <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
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
    } else {
      // error display
      questionElement.innerHTML = `
        <div class='govgr-field govgr-field__error' id='$id-error'>
          <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
            ${question.question}
          </legend>
          <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
            <legend class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
              Επιλέξτε την απάντησή σας
            </legend>
            <p class='govgr-hint language-component' data-component='oneAnswer'>
              Μπορείτε να επιλέξετε μόνο μία επιλογή.
            </p>
            <div class='govgr-radios' id='radios-${questionId}'>
              <p class='govgr-error-message'>
                <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                <span class='language-component' data-component='choose'>
                  Πρέπει να επιλέξετε μια απάντηση
                </span>
              </p>
              ${question.options
                .map(
                  (option, index) => `
                    <div class='govgr-radios__item'>
                      <label class='govgr-label govgr-radios__label'>
                        ${option}
                        <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                      </label>
                    </div>
                `
                )
                .join("")}
            </div>
          </fieldset>
        </div>
      `;

      // If english, update text
      if (currentLanguage === "english") {
        var components = Array.from(
          questionElement.querySelectorAll(".language-component")
        );
        components.slice(-4).forEach(function (component) {
          var componentName = component.dataset.component;
          component.textContent =
            languageContent[currentLanguage][componentName];
        });
      }
    }

    $(".question-container").html(questionElement);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? ""
        : ""; 
        // (ή κρατήστε το παλιό "Λυπούμαστε αλλά δεν δικαιούστε το δελτίο μετακίνησης ΑΜΕΑ!" αν θέλετε...)
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  function retrieveAnswers() {
    // (Αν το χρειάζεστε ακόμα, διατηρήστε τον κώδικα. Διαφορετικά μπορείτε να αφαιρέσετε.)
    var allAnswers = [];
    getEvidencesById(1);
    for (var i = 0; i < totalQuestions; i++) {
      var answer = sessionStorage.getItem("answer_" + i);
      allAnswers.push(answer);
    }
    // ...
  }

  function submitForm() {
    // Αν κάποτε φτάσει linear στο τέλος, δείξτε κάποιο μήνυμα ή μην το χρησιμοποιήσετε
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
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά που πρέπει να προσκομίσετε είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The documents you need to provide are the following:</h5><br />"
        );
    $(".question-container").append(evidenceListElement);
    $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  // ==========================
  // Κύρια Λογική Next
  // ==========================
  $("#nextQuestion").click(function () {
    // 1) Έλεγχος αν ο χρήστης διάλεξε κάτι
    if ($(".govgr-radios__input").is(":checked")) {
      // selectedRadioButtonIndex (1-based)
      var selectedRadioButtonIndex =
        $('input[name="question-option"]').index(
          $('input[name="question-option"]:checked')
        ) + 1;
      console.log("Q=", currentQuestion, " / Answer=", selectedRadioButtonIndex);

      // Αποθηκεύουμε την απάντηση
      userAnswers[currentQuestion] = selectedRadioButtonIndex;
      sessionStorage.setItem(
        "answer_" + currentQuestion,
        selectedRadioButtonIndex
      );

      // ==============
      // ΕΡΩΤΗΣΗ 1 => currentQuestion = 0
      // ==============
      if (currentQuestion === 0) {
        if (selectedRadioButtonIndex === 1) {
          // Πρώτη εγγραφή => πάμε ερώτηση 3
          currentQuestion = 2;
          loadQuestion(currentQuestion, true);
        } else if (selectedRadioButtonIndex === 2) {
          // Ανανέωση => πάμε ερώτηση 2
          currentQuestion = 1;
          loadQuestion(currentQuestion, true);
        }

      // ==============
      // ΕΡΩΤΗΣΗ 2 => currentQuestion = 1
      // ==============
      } else if (currentQuestion === 1) {
        if (selectedRadioButtonIndex === 1) {
          // Ναι => skipToEnd (με μήνυμα)
          currentQuestion = -1;
          skipToEnd("Αν ο/η μαθητής/τρια πρόκειται να αλλάξει σχολείο χρειάζονται να προσκομίσεται στο σχολείο της επιλογής σας: \n" +
                    "1. Εκτύπωση Ε1 ή Ε9 (για τη διεύθυνση)\n" +
                    "2. Ένας πρόσφατος λογαριασμός ΔΕΚΟ\n" +
                    "3. Αίτηση από την ιστοσελίδα του νέου σχολείου.");
        } else if (selectedRadioButtonIndex === 2) {
          // Όχι => skipToEnd (με μήνυμα)
          currentQuestion = -1;
          skipToEnd("Η ανανέωση εγγραφής γίνεται αυτόματα. Για περισσότερα επικοινωνήστε με το σχολείο σας.");
        }

      // ==============
      // ΕΡΩΤΗΣΗ 3 => currentQuestion = 2
      // ==============
      } else if (currentQuestion === 2) {
        if (selectedRadioButtonIndex === 1) {
          // Πρόσφατος => πάμε ερώτηση 5
          currentQuestion = 4;
          loadQuestion(currentQuestion, true);
        } else if (selectedRadioButtonIndex === 2) {
          // Παλαιό => πάμε ερώτηση 4
          currentQuestion = 3;
          loadQuestion(currentQuestion, true);
        }

      // ==============
      // ΕΡΩΤΗΣΗ 4 => currentQuestion = 3
      // ==============
      } else if (currentQuestion === 3) {
        if (selectedRadioButtonIndex === 1) {
          // Ανήλικος άνω 16 => skipToEnd
          currentQuestion = -1;
          skipToEnd("Η αίτηση γίνεται από τον γονέα/κηδεμόνα, στο σχολείο της επιλογής σας.");
        } else if (selectedRadioButtonIndex === 2) {
          // Ενήλικος => skipToEnd
          currentQuestion = -1;
          skipToEnd("Η αίτηση μπορεί να γίνει από τον ίδιο/την ίδια, στο σχολείο της επιλογής του/της.");
        }

      // ==============
      // ΕΡΩΤΗΣΗ 5 => currentQuestion = 4
      // ==============
      } else if (currentQuestion === 4) {
        if (selectedRadioButtonIndex === 1) {
          currentQuestion = -1;
          skipToEnd("Για μαθητές από χώρα της Ε.Ε. εκτός Ελλάδας απαιτείται...\n(κείμενο)");
        } else if (selectedRadioButtonIndex === 2) {
          currentQuestion = -1;
          skipToEnd("Για μαθητές από χώρα εκτός Ε.Ε. απαιτείται...\n(κείμενο)");
        } else if (selectedRadioButtonIndex === 3) {
          currentQuestion = -1;
          skipToEnd("Για μαθητές από ελληνικό σχολείο εξωτερικού απαιτούνται...\n(κείμενο)");
        } else if (selectedRadioButtonIndex === 4) {
          currentQuestion = -1;
          skipToEnd("");
        }

      } else {
        // Απρόσμενη περίπτωση
        currentQuestion = -1;
        skipToEnd("Δεν υπάρχει άλλη ερώτηση. Τερματισμός.");
      }

    } else {
      // Δεν επέλεξε τίποτα -> load με error
      loadQuestion(currentQuestion, false);
    }
  });

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      // Retrieve the answer for the previous question from userAnswers
      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1) {
      loadQuestion(currentQuestion, true);
    }
  });

  $("#questions-btns").hide();

  // Αρχική φόρτωση όλων των δεδομένων
  getQuestions().then(() => {
    getEvidences().then(() => {
      getFaq().then(() => {
        // Αφού φορτωθούν, δείχνουμε FAQs, πρώτη ερώτηση
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
