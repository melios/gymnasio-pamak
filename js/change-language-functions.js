var languageContent = {
  greek: {
    languageBtn: "EL",
    mainTitle: "Εγγραφή μαθητών στο Γυμνάσιο",
    pageTitle: "Εγγραφή μαθητών στο Γυμνάσιο",
    infoTitle: "Πληροφορίες για την εγγραφή μαθητών στο Γυμνάσιο",
    subTitle1: "Αυτό το σύστημα θα σας βοηθήσει να ενημερωθείτε για τη διαδικασία εγγραφής μαθητών στο Γυμνάσιο.",
    subTitle2: "",
    subTitle3: "",
    backButton: "Πίσω",
    nextQuestion: "Επόμενη ερώτηση",
    biggerCursor: "Μεγαλύτερος Δρομέας",
    bigFontSize: "Μεγάλο Κείμενο",
    readAloud: "Ανάγνωση",
    changeContrast: "Αντίθεση",
    readingMask: "Μάσκα Ανάγνωσης",
    footerText: "Το έργο αυτό δημιουργήθηκε για τις ανάγκες της εργασίας στο Συστήματα Ηλεκτρονικής Διακυβέρνησης και αποτελεί μέρος της εφαρμογής για την εγγραφή μαθητών στο Γυμνάσιο.",
    and: "και",
    student1: "Μελέτιος Νίγδελης",
    startBtn:"Ας ξεκινήσουμε",
    chooseAnswer: "Επιλέξτε την απάντησή σας",
    oneAnswer: "Μπορείτε να επιλέξετε μόνο μία επιλογή.",
    errorAn: "Λάθος:",
    choose: "Πρέπει να επιλέξετε μια απάντηση"
  },
  english: {
    languageBtn: "EN",
    mainTitle: "High School Enrollment",
    pageTitle: "High School Enrollment",
    infoTitle: "Enrollment Information for High School",
    subTitle1: "This system will help you obtain detailed information on the enrollment process for High School.",
    subTitle2: "The document submission process should not take more than 10 minutes.",
    subTitle3: "Your data will not be stored or shared.",
    backButton: "Back",
    nextQuestion: "Next Question",
    biggerCursor: "Bigger Cursor",
    bigFontSize:" Big Font Size",
    readAloud: "Read Aloud",
    changeContrast:" Change Contrast",
    readingMask:" Reading Mask",
    footerText: "This project was developed as part of the Electronic Governance Systems course at the University of Macedonia by the students of Applied Informatics.",
    and: "and",
    student1: "Meletios Nigdelis",
    startBtn:"Let's start",
    chooseAnswer: "Choose your answer",
    oneAnswer: "You can choose only one option.",
    errorAn: "Error:",
    choose: "You must choose one option"
  }
};
  
  
// Retrieve the selected language from localStorage or set default to "greek"
var currentLanguage = localStorage.getItem("preferredLanguage") || "greek";

function toggleLanguage() {
    currentLanguage = currentLanguage === "greek" ? "english" : "greek";
    localStorage.setItem("preferredLanguage", currentLanguage);
    updateContent();
}

function updateContent() {
    var components = document.querySelectorAll(".language-component");
     
    components.forEach(function (component) {
        var componentName = component.dataset.component;
        component.textContent = languageContent[currentLanguage][componentName];
    });
}

// Initialize the content based on the selected language
updateContent();
