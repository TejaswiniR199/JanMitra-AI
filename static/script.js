const complaintForm = document.getElementById("complaintForm");
const result = document.getElementById("result");
const trackingButton = document.getElementById("trackButton");
const trackingResult = document.getElementById("trackingResult");

// Submit a new complaint
complaintForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const complaint = {
        citizen: document.getElementById("citizen").value.trim(),
        area: document.getElementById("area").value.trim(),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value.trim()
    };

    if (!complaint.citizen || !complaint.area ||
        !complaint.category || !complaint.description) {
        result.textContent = "Please fill in all the fields.";
        return;
    }

    result.textContent = "Submitting your complaint...";

    try {
        const response = await fetch("/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaint)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to submit complaint.");
        }

        result.textContent =
            "Complaint submitted successfully! Reference ID: " +
            data.id + ". Category: " + data.category +
            ". Priority: " + data.priority +
            ". Similar complaints found: " + data.duplicate_count +
            ". Please save your reference ID to track your complaint.";

        complaintForm.reset();

    } catch (error) {
        result.textContent = error.message;
    }
});


// Track an existing complaint
trackingButton.addEventListener("click", async function () {
    const trackingId =
        document.getElementById("trackingId").value.trim();

    if (!trackingId) {
        trackingResult.textContent =
            "Please enter your complaint reference ID.";
        return;
    }

    trackingResult.textContent = "Searching for your complaint...";

    try {
        const response = await fetch(
            "/api/track/" + encodeURIComponent(trackingId)
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Complaint not found.");
        }

        trackingResult.textContent =
            "Complaint ID: " + data.id +
            " | Category: " + data.category +
            " | Area: " + data.area +
            " | Priority: " + data.priority +
            " | Status: " + data.status;

    } catch (error) {
        trackingResult.textContent = error.message;
    }
});


// Allow tracking with the Enter key
document.getElementById("trackingId").addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            trackingButton.click();
        }
    }
);

console.log("JanMitra AI JavaScript loaded successfully!");
// JanMitra AI - Multilingual Support

const translations = {
    en: {
        tagline: "YOUR VOICE. YOUR RIGHTS. YOUR SOLUTION.",
        heroTitle: "Making Every Citizen's Voice Count.",
        heroDescription: "Report civic problems easily using your preferred language. Our intelligent grievance platform helps identify, classify and track public complaints.",
        submitButton: "Submit a Complaint →",
        heroCardTitle: "One Platform. Every Citizen.",
        heroCardDescription: "Connecting citizens with smarter public services.",
        accessible: "Accessible",
        languages: "Languages",
        powered: "Powered",
        featuresTitle: "How JanMitra AI Helps",
        featuresSubtitle: "Smarter grievance management for everyone",
        multilingual: "Multilingual Support",
        multilingualDescription: "Communicate in English, Kannada and Hindi.",
        aiClassification: "AI Classification",
        aiDescription: "Automatically identify complaint categories.",
        smartPriority: "Smart Priority",
        priorityDescription: "Identify complaints that may require urgent attention.",
        duplicateDetection: "Duplicate Detection",
        duplicateDescription: "Find similar complaints and recurring civic problems.",
        complaintTitle: "Submit Your Complaint",
        complaintDescription: "Tell us about the problem in your area.",
        name: "Your Name",
        namePlaceholder: "Enter your name",
        area: "Location / Area",
        areaPlaceholder: "Enter your area",
        category: "Complaint Category",
        selectCategory: "Select category",
        garbage: "Garbage",
        water: "Water Supply",
        road: "Road Damage",
        electricity: "Electricity",
        drainage: "Drainage",
        other: "Other",
        description: "Describe Your Complaint",
        descriptionPlaceholder: "Describe your problem here...",
        submit: "Submit Complaint",
        trackTitle: "Track Your Complaint",
        trackDescription: "Enter your complaint reference number.",
        trackPlaceholder: "Enter reference ID",
        trackButton: "Track",
        footerTagline: "Your Voice. Your Rights. Your Solution.",
        footerCopyright: "© 2026 JanMitra AI | Hackathon Project"
    },

    kn: {
        tagline: "ನಿಮ್ಮ ಧ್ವನಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳು. ನಿಮ್ಮ ಪರಿಹಾರ.",
        heroTitle: "ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನ ಧ್ವನಿಗೂ ಮಹತ್ವ.",
        heroDescription: "ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆಯಲ್ಲಿ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. ನಮ್ಮ ವೇದಿಕೆ ಸಾರ್ವಜನಿಕ ದೂರುಗಳನ್ನು ಗುರುತಿಸಲು, ವರ್ಗೀಕರಿಸಲು ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
        submitButton: "ದೂರು ಸಲ್ಲಿಸಿ →",
        heroCardTitle: "ಒಂದು ವೇದಿಕೆ. ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನಿಗಾಗಿ.",
        heroCardDescription: "ಉತ್ತಮ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳೊಂದಿಗೆ ನಾಗರಿಕರನ್ನು ಸಂಪರ್ಕಿಸುವುದು.",
        accessible: "ಲಭ್ಯವಿದೆ",
        languages: "ಭಾಷೆಗಳು",
        powered: "ಚಾಲಿತ",
        featuresTitle: "ಜನಮಿತ್ರ AI ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ",
        featuresSubtitle: "ಎಲ್ಲರಿಗೂ ಉತ್ತಮ ದೂರು ನಿರ್ವಹಣೆ",
        multilingual: "ಬಹುಭಾಷಾ ಬೆಂಬಲ",
        multilingualDescription: "ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಮತ್ತು ಹಿಂದಿಯಲ್ಲಿ ಸಂವಹನ ಮಾಡಿ.",
        aiClassification: "AI ವರ್ಗೀಕರಣ",
        aiDescription: "ದೂರುಗಳ ವರ್ಗಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಗುರುತಿಸುತ್ತದೆ.",
        smartPriority: "ಸ್ಮಾರ್ಟ್ ಆದ್ಯತೆ",
        priorityDescription: "ತುರ್ತು ಗಮನ ಅಗತ್ಯವಿರುವ ದೂರುಗಳನ್ನು ಗುರುತಿಸುತ್ತದೆ.",
        duplicateDetection: "ಪುನರಾವರ್ತಿತ ದೂರು ಪತ್ತೆ",
        duplicateDescription: "ಒಂದೇ ರೀತಿಯ ದೂರುಗಳು ಮತ್ತು ಪುನರಾವರ್ತಿತ ಸಮಸ್ಯೆಗಳನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ.",
        complaintTitle: "ನಿಮ್ಮ ದೂರನ್ನು ಸಲ್ಲಿಸಿ",
        complaintDescription: "ನಿಮ್ಮ ಪ್ರದೇಶದ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.",
        name: "ನಿಮ್ಮ ಹೆಸರು",
        namePlaceholder: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
        area: "ಸ್ಥಳ / ಪ್ರದೇಶ",
        areaPlaceholder: "ನಿಮ್ಮ ಪ್ರದೇಶವನ್ನು ನಮೂದಿಸಿ",
        category: "ದೂರಿನ ವರ್ಗ",
        selectCategory: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        garbage: "ಕಸ",
        water: "ನೀರು ಸರಬರಾಜು",
        road: "ರಸ್ತೆ ಹಾನಿ",
        electricity: "ವಿದ್ಯುತ್",
        drainage: "ಚರಂಡಿ",
        other: "ಇತರೆ",
        description: "ನಿಮ್ಮ ದೂರನ್ನು ವಿವರಿಸಿ",
        descriptionPlaceholder: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ...",
        submit: "ದೂರು ಸಲ್ಲಿಸಿ",
        trackTitle: "ನಿಮ್ಮ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        trackDescription: "ನಿಮ್ಮ ದೂರಿನ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
        trackPlaceholder: "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
        trackButton: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
        footerTagline: "ನಿಮ್ಮ ಧ್ವನಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳು. ನಿಮ್ಮ ಪರಿಹಾರ.",
        footerCopyright: "© 2026 ಜನಮಿತ್ರ AI | ಹ್ಯಾಕಥಾನ್ ಪ್ರಾಜೆಕ್ಟ್"
    },

    hi: {
        tagline: "आपकी आवाज़। आपके अधिकार। आपका समाधान।",
        heroTitle: "हर नागरिक की आवाज़ महत्वपूर्ण है।",
        heroDescription: "अपनी पसंदीदा भाषा में नागरिक समस्याओं की रिपोर्ट करें। हमारा प्लेटफॉर्म सार्वजनिक शिकायतों को पहचानने, वर्गीकृत करने और ट्रैक करने में मदद करता है।",
        submitButton: "शिकायत दर्ज करें →",
        heroCardTitle: "एक प्लेटफॉर्म। हर नागरिक के लिए।",
        heroCardDescription: "नागरिकों को बेहतर सार्वजनिक सेवाओं से जोड़ना।",
        accessible: "उपलब्ध",
        languages: "भाषाएँ",
        powered: "संचालित",
        featuresTitle: "जनमित्र AI कैसे मदद करता है",
        featuresSubtitle: "सभी के लिए बेहतर शिकायत प्रबंधन",
        multilingual: "बहुभाषी सहायता",
        multilingualDescription: "अंग्रेज़ी, कन्नड़ और हिंदी में संवाद करें।",
        aiClassification: "AI वर्गीकरण",
        aiDescription: "शिकायतों की श्रेणियों को स्वचालित रूप से पहचानें।",
        smartPriority: "स्मार्ट प्राथमिकता",
        priorityDescription: "तत्काल ध्यान देने वाली शिकायतों की पहचान करें।",
        duplicateDetection: "दोहराई गई शिकायतों की पहचान",
        duplicateDescription: "समान शिकायतों और बार-बार होने वाली समस्याओं को पहचानें।",
        complaintTitle: "अपनी शिकायत दर्ज करें",
        complaintDescription: "अपने क्षेत्र की समस्या के बारे में बताएं।",
        name: "आपका नाम",
        namePlaceholder: "अपना नाम दर्ज करें",
        area: "स्थान / क्षेत्र",
        areaPlaceholder: "अपना क्षेत्र दर्ज करें",
        category: "शिकायत की श्रेणी",
        selectCategory: "श्रेणी चुनें",
        garbage: "कचरा",
        water: "पानी की आपूर्ति",
        road: "सड़क की क्षति",
        electricity: "बिजली",
        drainage: "जल निकासी",
        other: "अन्य",
        description: "अपनी शिकायत का विवरण दें",
        descriptionPlaceholder: "अपनी समस्या यहाँ लिखें...",
        submit: "शिकायत दर्ज करें",
        trackTitle: "अपनी शिकायत ट्रैक करें",
        trackDescription: "अपनी शिकायत की संदर्भ संख्या दर्ज करें।",
        trackPlaceholder: "संदर्भ ID दर्ज करें",
        trackButton: "ट्रैक करें",
        footerTagline: "आपकी आवाज़। आपके अधिकार। आपका समाधान।",
        footerCopyright: "© 2026 जनमित्र AI | हैकथॉन प्रोजेक्ट"
    }
};

function changeLanguage(lang) {
    const t = translations[lang] || translations.en;

    const setText = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
    };

    const setPlaceholder = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.placeholder = value;
    };

    setText(".tagline", t.tagline);
    setText(".hero-content h1", t.heroTitle);
    setText(".hero-content > p:not(.tagline)", t.heroDescription);
    setText(".hero-content .primary-btn", t.submitButton);
    setText(".hero-card h2", t.heroCardTitle);
    setText(".hero-card > p", t.heroCardDescription);

    const smallTexts = document.querySelectorAll(".hero-stats small");
    [t.accessible, t.languages, t.powered].forEach((value, i) => {
        if (smallTexts[i]) smallTexts[i].textContent = value;
    });

    setText(".features > h2", t.featuresTitle);
    setText(".section-subtitle", t.featuresSubtitle);

    const featureCards = document.querySelectorAll(".feature-card");
    const featureTitles = [
        t.multilingual, t.aiClassification,
        t.smartPriority, t.duplicateDetection
    ];
    const featureDescriptions = [
        t.multilingualDescription, t.aiDescription,
        t.priorityDescription, t.duplicateDescription
    ];

    featureCards.forEach((card, i) => {
        const heading = card.querySelector("h3");
        const paragraph = card.querySelector("p");
        if (heading) heading.textContent = featureTitles[i];
        if (paragraph) paragraph.textContent = featureDescriptions[i];
    });

    setText(".form-container h2", t.complaintTitle);
    setText(".form-container > p", t.complaintDescription);

    ["citizen", "area", "category", "description"].forEach((id, i) => {
        const label = document.querySelector(`label[for="${id}"]`);
        const labels = [t.name, t.area, t.category, t.description];
        if (label) label.textContent = labels[i];
    });

    setPlaceholder("#citizen", t.namePlaceholder);
    setPlaceholder("#area", t.areaPlaceholder);
    setPlaceholder("#description", t.descriptionPlaceholder);

    const categoryOptions = document.querySelectorAll("#category option");
    const optionTexts = [
        t.selectCategory, t.garbage, t.water,
        t.road, t.electricity, t.drainage, t.other
    ];

    categoryOptions.forEach((option, i) => {
        if (optionTexts[i]) option.textContent = optionTexts[i];
    });

    setText("#complaintForm button", t.submit);
    setText(".tracking-section h2", t.trackTitle);
    setText(".tracking-section > p", t.trackDescription);
    setPlaceholder("#trackingId", t.trackPlaceholder);
    setText("#trackButton", t.trackButton);
    setText("footer > p:nth-of-type(1)", t.footerTagline);
    setText("footer > p:nth-of-type(2)", t.footerCopyright);
}

const languageSelector = document.getElementById("language");

if (languageSelector) {
    languageSelector.addEventListener("change", function () {
        changeLanguage(this.value);
    });
}