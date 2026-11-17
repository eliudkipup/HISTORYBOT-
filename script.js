
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. ELEMENTS
    // =========================================

    const get = id => document.getElementById(id);

    const welcomeScreen = get("welcome-screen");

    const introPages = [
        get("intro-page-1"),
        get("intro-page-2"),
        get("intro-page-3"),
        get("intro-page-4")
    ];

    const startExploring = get("start-exploring");

    const chatPage = get("chat-page");
    const quizPage = get("quiz-section");
    const favoritesPage = get("favorites-page");
    const libraryPage = get("library-page");
    const themesPage = get("themes-page");
    const settingsPage = get("settings-page");
    const aboutPage = get("about-page");
    const dataStoragePage = get("data-storage-page");
  const notificationsPage = get("notifications");

    const navigationMenu = get("navigation-menu");
    const menuToggle = get("menu-toggle");
    const menuOptions = get("menu-options");

    const myChatsMenu = get("my-chats-menu");
    const favoritesMenu = get("favorites-menu");
    const historyQuizMenu = get("history-quiz-menu");
    const libraryMenu = get("history-library-menu");
    const settingsMenu = get("settings-menu");
    const openThemes = get("open-themes");

    const themeCards = document.querySelectorAll(".theme-card");

    const chatBox = get("chat-box");
    const userInput = get("user-input");
    const sendBtn = get("send-btn");

    const clearChatBtn = get("clear-chat");
    const newChatBtn = get("new-chat");

    const chatList = get("chat-list");
    const favoritesList = get("favorites-list");

    const savedChats = document.querySelector(
        ".conversations-container"
    );

    const libraryArticles = get("library-articles");
    const articleReader = get("article-reader");
    const articleContent = get("article-content");
    const backToLibrary = get("back-to-library");

    const historySearch = get("history-search");
    const clearHistorySearch = get("clear-history-search");
    const searchResults = get("search-results");
    const libraryMainContent = get("library-main-content");

    let lastSearchQuery = "";
  
// =========================================
// PAGE NAVIGATION HISTORY
// =========================================

let pageHistory = [];
let currentPage = null;
let isGoingBack = false;
  
    // =========================================
    // 2. PAGE NAVIGATION
    // =========================================

    const allPages = [
        chatPage,
        quizPage,
        favoritesPage,
        libraryPage,
        themesPage,
        settingsPage,
        aboutPage,
        dataStoragePage,
        notificationsPage
    ];

    function hideAllPages() {

        allPages.forEach(function (page) {

            if (page) {
                page.style.display = "none";
            }

        });

    }

    function closeMenu() {

        if (menuOptions) {
            menuOptions.classList.remove("show");
        }

    }

    
function showPage(page, resetHistory = false) {

    if (!page) {
        console.error("HISTORYBOT: Requested page is missing.");
        return;
    }

    // Reset navigation when starting from the homepage
    if (resetHistory) {
        pageHistory = [];
    }

    // Remember the previous page
    if (
        currentPage &&
        currentPage !== page &&
        !isGoingBack &&
        !resetHistory
    ) {
        pageHistory.push(currentPage);
    }

    hideAllPages();

    page.style.display =
        page === chatPage ? "flex" : "block";

    currentPage = page;

    closeMenu();

    updateBackButtons();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

  
// =========================================
// BACK BUTTON SYSTEM
// =========================================

function updateBackButtons() {

    allPages.forEach(function (page) {

        if (!page) return;

        const backButton = page.querySelector(
            ".page-back-button"
        );

        if (backButton) {
            backButton.style.display =
                page === currentPage && pageHistory.length > 0
                    ? "inline-flex"
                    : "none";
        }

    });

}

// CREATE BACK BUTTONS AUTOMATICALLY

allPages.forEach(function (page) {

    if (!page) return;

    // Avoid creating duplicate buttons
    if (page.querySelector(".page-back-button")) {
        return;
    }

    const backButton = document.createElement("button");

    backButton.type = "button";
    backButton.className = "page-back-button";
    backButton.textContent = "← Back";
    backButton.style.display = "none";

    backButton.addEventListener("click", goBack);

    page.insertBefore(backButton, page.firstChild);

});

// RETURN TO PREVIOUS PAGE

function goBack() {

    if (pageHistory.length === 0) {
        return;
    }

    const previousPage = pageHistory.pop();

    isGoingBack = true;

    showPage(previousPage);

    isGoingBack = false;

    updateBackButtons();

}


    // =========================================
    // 3. AUTOMATIC INTRODUCTION
    // =========================================

    let currentIntroPage = 0;
    let introTimer = null;

    hideAllPages();

    if (navigationMenu) {
        navigationMenu.style.display = "none";
    }

    function showIntroPage(index) {

        introPages.forEach(function (page, pageIndex) {

            if (!page) return;

            page.classList.remove("active", "leaving");

            if (pageIndex === index) {
                page.classList.add("active");
            }

        });

    }

    function playIntroduction() {

        if (introPages.some(function (page) {
            return !page;
        })) {

            console.error(
                "HISTORYBOT: One or more introduction pages are missing."
            );

            return;
        }

        currentIntroPage = 0;

        showIntroPage(currentIntroPage);

        clearInterval(introTimer);

        introTimer = setInterval(function () {

            currentIntroPage++;

            if (currentIntroPage >= introPages.length) {

                clearInterval(introTimer);
                introTimer = null;

                currentIntroPage = introPages.length - 1;

                showIntroPage(currentIntroPage);

                return;
            }

            showIntroPage(currentIntroPage);

        }, 3000);

    }

    playIntroduction();

    // START EXPLORING

    if (startExploring) {

        startExploring.addEventListener("click", function () {

            clearInterval(introTimer);
            introTimer = null;

            if (welcomeScreen) {

                welcomeScreen.style.transition =
                    "opacity 1s ease";

                welcomeScreen.style.opacity = "0";

            }

            setTimeout(function () {

                if (welcomeScreen) {
                    welcomeScreen.style.display = "none";
                }

                showPage(libraryPage,true);

                if (navigationMenu) {
                    navigationMenu.style.display = "block";
                }

            }, 1000);

        });

    }

    // =========================================
    // 4. CONVERSATION STORAGE
    // =========================================

    const STORAGE_KEY = "historybot-conversations-v2";
    const OLD_STORAGE_KEY = "historybot-chat-history";
    const CURRENT_CHAT_KEY = "historybot-current-conversation";

    let conversations = [];
    let currentConversationId = null;

    function createConversation() {

        return {
            id: Date.now().toString() +
                Math.random().toString(36).slice(2, 8),

            title: "New Conversation",
            messages: [],
            isFavorite: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

    }

    function getCurrentConversation() {

        return conversations.find(function (conversation) {

            return conversation.id === currentConversationId;

        });

    }

    function saveConversations() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(conversations)
            );

            localStorage.setItem(
                CURRENT_CHAT_KEY,
                currentConversationId || ""
            );

        } catch (error) {

            console.error(
                "Could not save conversations:",
                error
            );

        }

    }

    function loadConversations() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData) {

                const parsedData = JSON.parse(savedData);

                if (Array.isArray(parsedData)) {

                    conversations = parsedData.filter(
                        function (item) {

                            return item &&
                                typeof item.id === "string" &&
                                Array.isArray(item.messages);

                        }
                    );

                }

            } else {

                // MIGRATE OLD CHAT HISTORY

                const oldHistory = localStorage.getItem(
                    OLD_STORAGE_KEY
                );

                if (oldHistory) {

                    const oldMessages = JSON.parse(oldHistory);

                    if (Array.isArray(oldMessages)) {

                        const migrated = createConversation();

                        migrated.messages = oldMessages.filter(
                            function (message) {

                                return message &&
                                    typeof message.text === "string" &&
                                    (
                                        message.sender === "user" ||
                                        message.sender === "bot"
                                    );

                            }
                        );

                        conversations.push(migrated);

                    }

                }

            }

            if (conversations.length === 0) {
                conversations.push(createConversation());
            }

            conversations.forEach(function (conversation) {

                if (typeof conversation.isFavorite !== "boolean") {
                    conversation.isFavorite = false;
                }

                if (typeof conversation.title !== "string") {
                    conversation.title = "New Conversation";
                }

            });

            const savedCurrentId = localStorage.getItem(
                CURRENT_CHAT_KEY
            );

            const savedConversation = conversations.find(
                function (conversation) {

                    return conversation.id === savedCurrentId;

                }
            );

            currentConversationId = savedConversation
                ? savedConversation.id
                : conversations[0].id;

            saveConversations();

        } catch (error) {

            console.error("Could not load conversations:", error);

            conversations = [createConversation()];

            currentConversationId = conversations[0].id;

            saveConversations();

        }

    }

    // =========================================
    // 5. DISPLAY CONVERSATIONS
    // =========================================

    function displayConversation() {

    if (!chatBox) return;

    chatBox.innerHTML = "";

    const conversation = getCurrentConversation();

    if (!conversation) return;

    if (conversation.messages.length === 0) {

        const welcomeMessage = document.createElement("div");

        welcomeMessage.classList.add("message", "bot");

        welcomeMessage.textContent =
            "Welcome to HISTORYBOT! Ask me anything about Kenyan, African or world history.";

        chatBox.appendChild(welcomeMessage);

    }

    conversation.messages.forEach(function (message) {

        if (
            !message ||
            typeof message.text !== "string" ||
            (message.sender !== "user" &&
             message.sender !== "bot")
        ) {
            return;
        }

        const element = document.createElement("div");

        element.classList.add("message", message.sender);

        element.textContent = message.text;

        chatBox.appendChild(element);

    });

    chatBox.scrollTop = chatBox.scrollHeight;

    }
    function renderChatList() {

        if (!chatList) return;

        chatList.innerHTML = "";

        conversations.forEach(function (conversation) {

            const item = document.createElement("div");

            item.classList.add("conversation-item");

            if (conversation.id === currentConversationId) {
                item.classList.add("active-conversation");
            }

            // OPEN CHAT

            const openButton = document.createElement("button");

            openButton.classList.add("conversation-open");

            openButton.textContent =
                conversation.title || "New Conversation";

            openButton.addEventListener("click", function () {

                currentConversationId = conversation.id;

                saveConversations();
                displayConversation();
                renderChatList();

                showPage(chatPage);

            });

            // FAVORITE CHAT

            const favoriteButton = document.createElement("button");

            favoriteButton.classList.add("conversation-favorite");

            favoriteButton.textContent =
                conversation.isFavorite ? "⭐" : "☆";

            favoriteButton.title = conversation.isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites";

            favoriteButton.addEventListener("click", function () {

                conversation.isFavorite =
                    !conversation.isFavorite;

                saveConversations();
                renderChatList();
                renderFavorites();

            });

            // DELETE CHAT

            const deleteButton = document.createElement("button");

            deleteButton.classList.add("conversation-delete");

            deleteButton.textContent = "🗑️";

            deleteButton.addEventListener("click", function () {

                const confirmed = confirm(
                    "Delete this conversation permanently?"
                );

                if (!confirmed) return;

                conversations = conversations.filter(
                    function (item) {

                        return item.id !== conversation.id;

                    }
                );

                if (conversations.length === 0) {
                    conversations.push(createConversation());
                }

                if (currentConversationId === conversation.id) {

                    currentConversationId = conversations[0].id;

                }

                saveConversations();
                displayConversation();
                renderChatList();
                renderFavorites();

            });

            item.appendChild(openButton);
            item.appendChild(favoriteButton);
            item.appendChild(deleteButton);

            chatList.appendChild(item);

        });

    }

    // =========================================
    // 6. FAVORITES
    // =========================================

    function renderFavorites() {

        if (!favoritesList) return;

        favoritesList.innerHTML = "";

        const favorites = conversations.filter(
            function (conversation) {

                return conversation.isFavorite === true;

            }
        );

        if (favorites.length === 0) {

            favoritesList.textContent =
                "You haven't added any favorites yet.";

            return;
        }

        favorites.forEach(function (conversation) {

            const item = document.createElement("div");

            item.classList.add("conversation-item");

            const openButton = document.createElement("button");

            openButton.classList.add("conversation-open");

            openButton.textContent =
                conversation.title || "New Conversation";

            openButton.addEventListener("click", function () {

                currentConversationId = conversation.id;

                saveConversations();
                displayConversation();
                renderChatList();

                showPage(chatPage);

            });

            const removeButton = document.createElement("button");

            removeButton.classList.add("conversation-favorite");

            removeButton.textContent = "⭐";

            removeButton.addEventListener("click", function () {

                conversation.isFavorite = false;

                saveConversations();
                renderChatList();
                renderFavorites();

            });

            item.appendChild(openButton);
            item.appendChild(removeButton);

            favoritesList.appendChild(item);

        });

    }

    // =========================================
    // 7. NEW CHAT
    // =========================================

    function startNewChat() {

        const conversation = createConversation();

        conversations.unshift(conversation);

        currentConversationId = conversation.id;

        saveConversations();
        displayConversation();
        renderChatList();

        if (userInput) {

            userInput.value = "";
            userInput.focus();

        }

    }

    if (newChatBtn) {

        newChatBtn.addEventListener("click", startNewChat);

    }

    // =========================================
    // 8. CLEAR CHAT
    // =========================================

    if (clearChatBtn) {

        clearChatBtn.addEventListener("click", function () {

            const confirmed = confirm(
                "Clear all messages in this conversation?"
            );

            if (!confirmed) return;

            const conversation = getCurrentConversation();

            if (!conversation) return;

            conversation.messages = [];
            conversation.title = "New Conversation";
            conversation.updatedAt = Date.now();

            saveConversations();
            displayConversation();
            renderChatList();

        });

    }

    // =========================================
    // 9. INITIALIZE CONVERSATIONS
    // =========================================

    loadConversations();

    displayConversation();
    renderChatList();
    renderFavorites();

    // =========================================
    // 10. HISTORY DATABASE
    // =========================================

    const historyData = [

        {
            keywords: ["kenya independence", "independence of kenya"],
            answer: "Kenya gained independence from Britain on 12 December 1963. Jomo Kenyatta became the country's first Prime Minister."
        },

        {
            keywords: ["mau mau", "mau mau uprising"],
            answer: "The Mau Mau uprising was an anti-colonial movement in Kenya during the 1950s. It played an important role in the struggle for independence."
        },

        {
            keywords: ["jomo kenyatta", "who was kenyatta"],
            answer: "Jomo Kenyatta was Kenya's first Prime Minister and later its first President. He led the country after independence."
        },

        {
            keywords: ["stanley mathenge"],
            answer: "Stanley Mathenge was a prominent Mau Mau field commander during Kenya's struggle against British colonial rule."
        },

        {
            keywords: ["tom mboya"],
            answer: "Tom Mboya was a Kenyan independence activist, politician and trade unionist."
        },

        {
            keywords: ["wangari maathai"],
            answer: "Wangari Maathai was a Kenyan environmentalist and Nobel Peace Prize laureate. She founded the Green Belt Movement."
        },

        {
            keywords: ["ancient egypt", "egyptian civilization"],
            answer: "Ancient Egypt was one of the world's earliest civilizations, famous for its pyramids, pharaohs and achievements in mathematics and architecture."
        },

        {
            keywords: ["mansa musa", "mali empire"],
            answer: "Mansa Musa was a famous ruler of the Mali Empire in West Africa during the 14th century."
        },

        {
            keywords: ["great zimbabwe"],
            answer: "Great Zimbabwe was a major medieval African city known for its impressive stone architecture and role in regional trade."
        },

        {
            keywords: ["ghana empire"],
            answer: "The Ghana Empire was an important West African empire that became wealthy through trade, especially gold and salt."
        },

        {
            keywords: ["nelson mandela"],
            answer: "Nelson Mandela was a South African leader who fought against apartheid and later became South Africa's first Black president."
        },

        {
            keywords: ["kwame nkrumah"],
            answer: "Kwame Nkrumah led Ghana to independence in 1957 and became its first Prime Minister and later President."
        },

        {
            keywords: ["battle of adwa", "ethiopia"],
            answer: "The Battle of Adwa took place in 1896. Ethiopian forces defeated Italy, helping preserve Ethiopia's independence."
        },

        {
            keywords: ["world war 1", "world war i", "wwi"],
            answer: "World War I lasted from 1914 to 1918. It involved many major world powers."
        },

        {
            keywords: ["world war 2 causes", "causes of world war 2", "what caused world war 2"],
            answer: "Major causes of World War II included the Treaty of Versailles, aggressive dictatorships, expansionism, militarism and the failure of international peace efforts."
        },

        {
            keywords: ["world war 2", "world war ii", "wwii"],
            answer: "World War II lasted from 1939 to 1945. It was a global conflict involving the Allied Powers and Axis Powers."
        },

        {
            keywords: ["roman empire"],
            answer: "The Roman Empire was one of the most influential ancient civilizations. It developed across Europe, North Africa and parts of Asia."
        },

        {
            keywords: ["french revolution"],
            answer: "The French Revolution began in 1789. It challenged the monarchy and transformed French political and social life."
        },

        {
            keywords: ["industrial revolution"],
            answer: "The Industrial Revolution began in Britain in the 18th century. It transformed production through machinery, factories and new technologies."
        },

        {
            keywords: ["united nations", "what is the un"],
            answer: "The United Nations was established in 1945 to promote international peace, security and cooperation."
        },

        {
            keywords: ["mahatma gandhi", "gandhi"],
            answer: "Mahatma Gandhi was an important leader in India's independence movement. He promoted non-violent resistance."
        },

        {
            keywords: ["christopher columbus", "columbus"],
            answer: "Christopher Columbus was a European explorer whose 1492 voyage across the Atlantic initiated sustained contact between Europe and the Americas."
        }

    ];

    // =========================================
    // 11. CHATBOT ENGINE
    // =========================================

    function normalizeText(text) {

        return String(text).toLowerCase()
            .replace(/['’]/g, "")
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    }

    function saveChatHistory() {

        const conversation = getCurrentConversation();

        if (!conversation) return;

        conversation.updatedAt = Date.now();

        const firstUserMessage = conversation.messages.find(
            function (message) {

                return message.sender === "user";

            }
        );

        if (firstUserMessage) {

            conversation.title =
                firstUserMessage.text.length > 32
                    ? firstUserMessage.text.substring(0, 32) + "..."
                    : firstUserMessage.text;

        }

        saveConversations();
        renderChatList();

    }

    function addMessage(message, sender) {

        if (!chatBox) return;

        const conversation = getCurrentConversation();

        if (!conversation) return;

        conversation.messages.push({
            text: message,
            sender: sender
        });

        const element = document.createElement("div");

        element.classList.add("message", sender);

        element.textContent = message;

        chatBox.appendChild(element);

        chatBox.scrollTop = chatBox.scrollHeight;

        saveChatHistory();

    }

    function getHistoryAnswer(question) {

        const q = normalizeText(question);

        for (const item of historyData) {

            const matched = item.keywords.some(
                function (keyword) {

                    return q.includes(normalizeText(keyword));

                }
            );

            if (matched) {
                return item.answer;
            }

        }

        return "I don't have a verified answer in my current historical database yet. Try asking about Kenya, African history or world history.";

    }

    function sendMessage() {

        if (!userInput) return;

        const question = userInput.value.trim();

        if (!question) return;

        addMessage(question, "user");

        const answer = getHistoryAnswer(question);

        addMessage(answer, "bot");

        userInput.value = "";
        userInput.focus();

    }

    if (sendBtn && userInput) {

        sendBtn.addEventListener("click", sendMessage);

        userInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                sendMessage();
            }

        });

    }

    // =========================================
    // 12. QUIZ DATABASE
    // =========================================

    const quizQuestions = {

        beginner: [

            {
                question: "In which year did Kenya gain independence?",
                options: ["1952", "1963", "1970", "1945"],
                answer: 1,
                explanation: "Kenya gained independence on 12 December 1963."
            },

            {
                question: "Who was Kenya's first president?",
                options: ["Daniel arap Moi", "Raila Odinga", "Jomo Kenyatta", "Tom Mboya"],
                answer: 2,
                explanation: "Jomo Kenyatta became Kenya's first president in 1964."
            },

            {
                question: "Which ancient civilization built the pyramids of Giza?",
                options: ["Romans", "Greeks", "Egyptians", "Persians"],
                answer: 2,
                explanation: "The ancient Egyptians built the famous pyramids of Giza."
            },

            {
                question: "Who was a major leader against apartheid?",
                options: ["Nelson Mandela", "Kwame Nkrumah", "Mansa Musa", "Julius Nyerere"],
                answer: 0,
                explanation: "Nelson Mandela was a major leader in the struggle against apartheid."
            },

            {
                question: "In which year did World War II end?",
                options: ["1918", "1939", "1942", "1945"],
                answer: 3,
                explanation: "World War II ended in 1945."
            },

            {
                question: "Which empire was ruled by Mansa Musa?",
                options: ["Mali Empire", "Roman Empire", "Ghana Empire", "Ottoman Empire"],
                answer: 0,
                explanation: "Mansa Musa was a famous ruler of the Mali Empire."
            },

            {
                question: "Who led India's independence movement through non-violent resistance?",
                options: ["Winston Churchill", "Mahatma Gandhi", "Napoleon", "Abraham Lincoln"],
                answer: 1,
                explanation: "Mahatma Gandhi played a major role in India's independence movement."
            },

            {
                question: "Which organization was founded in 1945 to promote international peace?",
                options: ["African Union", "European Union", "United Nations", "NATO"],
                answer: 2,
                explanation: "The United Nations was founded in 1945."
            }

        ],

        intermediate: [

            {
                question: "What was a major aim of the Mau Mau uprising?",
                options: [
                    "To establish Roman rule",
                    "To resist British colonial rule",
                    "To create the United Nations",
                    "To expand trade with Europe"
                ],
                answer: 1,
                explanation: "The Mau Mau uprising was part of the struggle against British colonial rule in Kenya."
            },

            {
                question: "Which event directly triggered World War I?",
                options: [
                    "The French Revolution",
                    "The assassination of Archduke Franz Ferdinand",
                    "The fall of Rome",
                    "The Berlin Wall"
                ],
                answer: 1,
                explanation: "The assassination in Sarajevo in 1914 triggered the July Crisis and the outbreak of World War I."
            },

            {
                question: "Which country defeated Italy at the Battle of Adwa in 1896?",
                options: ["Kenya", "Egypt", "Ethiopia", "Sudan"],
                answer: 2,
                explanation: "Ethiopian forces defeated Italy at the Battle of Adwa."
            },

            {
                question: "Who led Ghana to independence in 1957?",
                options: ["Nelson Mandela", "Kwame Nkrumah", "Julius Nyerere", "Patrice Lumumba"],
                answer: 1,
                explanation: "Kwame Nkrumah led Ghana to independence in 1957."
            },

            {
                question: "What was the main purpose of the Berlin Conference of 1884–1885?",
                options: [
                    "To divide and regulate European claims in Africa",
                    "To end World War II",
                    "To create the African Union",
                    "To grant independence to African countries"
                ],
                answer: 0,
                explanation: "European powers negotiated rules for claiming territory in Africa."
            }

        ],

        advanced: [

            {
                question: "Which treaty formally ended the state of war between Germany and the Allied Powers after World War I?",
                options: [
                    "Treaty of Versailles",
                    "Treaty of Paris",
                    "Treaty of Rome",
                    "Treaty of Tordesillas"
                ],
                answer: 0,
                explanation: "The Treaty of Versailles was signed in 1919 and formally ended the war between Germany and the Allied Powers."
            },

            {
                question: "Which factor contributed significantly to the decline of the Mali Empire?",
                options: [
                    "The discovery of America",
                    "Internal conflicts and the rise of rival states",
                    "The Industrial Revolution",
                    "The fall of Constantinople"
                ],
                answer: 1,
                explanation: "Internal political struggles and the rise of competing powers weakened the Mali Empire."
            },

            {
                question: "What was a major consequence of the Industrial Revolution?",
                options: [
                    "The disappearance of all trade",
                    "The growth of factory production and urbanization",
                    "The end of international migration",
                    "The collapse of all European monarchies"
                ],
                answer: 1,
                explanation: "Industrialization expanded factory production and encouraged people to move into growing towns and cities."
            },

            {
                question: "Which principle was central to the Bandung Conference of 1955?",
                options: [
                    "Colonial expansion",
                    "Afro-Asian cooperation and peaceful coexistence",
                    "European military domination",
                    "The restoration of empires"
                ],
                answer: 1,
                explanation: "The Bandung Conference promoted cooperation, sovereignty and peaceful coexistence among Asian and African countries."
            },

            {
                question: "Which political system was established in South Africa after the 1994 democratic elections?",
                options: [
                    "Apartheid rule",
                    "Military dictatorship",
                    "A democratic government based on universal suffrage",
                    "Colonial administration"
                ],
                answer: 2,
                explanation: "The 1994 elections ended apartheid-era political exclusion and established democratic government based on universal adult suffrage."
            }

        ]

    };

    // =========================================
    // 13. QUIZ ENGINE
    // =========================================

    const startQuizBtn = get("start-quiz");
    const difficultySelect = get("quiz-difficulty");
    const quizBox = get("quiz-box");
    const quizProgress = get("quiz-progress");
    const quizQuestion = get("quiz-question");
    const quizOptions = get("quiz-options");
    const quizFeedback = get("quiz-feedback");
    const nextQuestionBtn = get("next-question");
    const quizResults = get("quiz-results");

    if (
        startQuizBtn &&
        difficultySelect &&
        quizBox &&
        quizProgress &&
        quizQuestion &&
        quizOptions &&
        quizFeedback &&
        nextQuestionBtn &&
        quizResults
    ) {

        let currentQuestions = [];
        let currentQuestion = 0;
        let quizScore = 0;
        let questionAnswered = false;

        function startQuiz() {

            const difficulty = difficultySelect.value;

            currentQuestions = quizQuestions[difficulty];

            if (!currentQuestions || !currentQuestions.length) {

                quizFeedback.textContent =
                    "No questions available for this difficulty.";

                return;
            }

            currentQuestion = 0;
            quizScore = 0;
            questionAnswered = false;

            quizResults.style.display = "none";
            quizBox.style.display = "block";
            startQuizBtn.style.display = "none";

            showQuestion();

        }

        function showQuestion() {

            questionAnswered = false;

            const question = currentQuestions[currentQuestion];

            quizProgress.textContent =
                "Question " + (currentQuestion + 1) +
                " of " + currentQuestions.length;

            quizQuestion.textContent = question.question;

            quizOptions.innerHTML = "";
            quizFeedback.textContent = "";

            nextQuestionBtn.style.display = "none";

            question.options.forEach(function (option, index) {

                const button = document.createElement("button");

                button.textContent = option;

                button.addEventListener("click", function () {

                    checkAnswer(index);

                });

                quizOptions.appendChild(button);

            });

        }

        function checkAnswer(selectedIndex) {

            if (questionAnswered) return;

            questionAnswered = true;

            const question = currentQuestions[currentQuestion];

            const buttons = quizOptions.querySelectorAll("button");

            buttons.forEach(function (button, index) {

                button.disabled = true;

                if (index === question.answer) {

                    button.style.background = "#d1fae5";
                    button.style.borderColor = "#16a34a";

                } else if (index === selectedIndex) {

                    button.style.background = "#fee2e2";
                    button.style.borderColor = "#dc2626";

                }

            });

            if (selectedIndex === question.answer) {

                quizScore++;

                quizFeedback.textContent =
                    "Correct! " + question.explanation;

                quizFeedback.style.color = "#15803d";

            } else {

                quizFeedback.textContent =
                    "Not quite. " + question.explanation;

                quizFeedback.style.color = "#dc2626";

            }

            nextQuestionBtn.style.display = "block";

            nextQuestionBtn.textContent =
                currentQuestion === currentQuestions.length - 1
                    ? "See Results"
                    : "Next Question";

        }

        function nextQuestion() {

            currentQuestion++;

            if (currentQuestion < currentQuestions.length) {

                showQuestion();

            } else {

                showQuizResults();

            }

        }

        function showQuizResults() {

            quizBox.style.display = "none";
            quizResults.style.display = "block";

            const percentage = Math.round(
                (quizScore / currentQuestions.length) * 100
            );

            quizResults.textContent =
                "Quiz completed! Your score: " +
                quizScore + " out of " +
                currentQuestions.length +
                " (" + percentage + "%).";

            startQuizBtn.textContent = "Try Again";
            startQuizBtn.style.display = "block";

        }

        startQuizBtn.addEventListener("click", startQuiz);

        difficultySelect.addEventListener("change", function () {

            quizBox.style.display = "none";
            quizResults.style.display = "none";

            startQuizBtn.style.display = "block";
            startQuizBtn.textContent = "Start Quiz";

        });

        nextQuestionBtn.addEventListener("click", nextQuestion);

    } else {

        console.warn(
            "HISTORYBOT Quiz: Some quiz HTML elements are missing."
        );

    }

    // =========================================
    // 14. HISTORY LIBRARY DATABASE
    // =========================================

    const historyArticles = {

        kenyan: [

            {
                title: "The Road to Kenyan Independence",

                intro: "Kenya's independence was the result of many years of political organisation, resistance and negotiations against British colonial rule.",

                sections: [

                    {
                        heading: "1. British Colonial Rule",
                        text: "Britain established colonial control over Kenya in the late nineteenth and early twentieth centuries. Colonial policies affected African land ownership, labour, political rights and economic opportunities. These changes created growing opposition among African communities."
                    },

                    {
                        heading: "2. The Rise of Nationalism",
                        text: "African political organisations emerged to demand greater rights and self-government. Leaders and organisations raised concerns about land alienation, racial discrimination and the lack of African representation in government."
                    },

                    {
                        heading: "3. The Mau Mau Uprising",
                        text: "The Mau Mau uprising began in the early 1950s, particularly involving communities in central Kenya. It challenged British colonial authority. The colonial government declared a state of emergency in 1952. The conflict involved severe repression, detention and suffering among many Kenyans."
                    },

                    {
                        heading: "4. Independence in 1963",
                        text: "Constitutional negotiations and political developments eventually led to independence. Kenya became independent on 12 December 1963. Jomo Kenyatta became the country's first Prime Minister. Kenya became a republic on 12 December 1964."
                    }

                ],

                summary: "Kenya's independence came through a long struggle involving political activism, resistance and constitutional negotiations. It marked the beginning of self-government."

            }

        ],

        african: [

            {
                title: "The Great Mali Empire",

                intro: "The Mali Empire was one of the most influential states in medieval West Africa. It became powerful through trade, strong leadership and control of important commercial routes.",

                sections: [

                    {
                        heading: "1. The Rise of Mali",
                        text: "The Mali Empire rose to prominence during the thirteenth century. Sundiata Keita is traditionally remembered as its founder. The empire expanded across important parts of West Africa."
                    },

                    {
                        heading: "2. Trade and Wealth",
                        text: "Mali became wealthy through trade in gold, salt and other goods. Its position along trans-Saharan trade routes helped connect West African communities with North Africa and the wider world."
                    },

                    {
                        heading: "3. Mansa Musa",
                        text: "Mansa Musa ruled Mali in the fourteenth century. His pilgrimage to Mecca in 1324 became famous and demonstrated the empire's wealth and international connections. He also supported scholarship and Islamic learning."
                    },

                    {
                        heading: "4. The Decline of Mali",
                        text: "Over time, political struggles, succession disputes and the rise of competing states weakened the empire. Its influence gradually declined, although its historical legacy remained important."
                    }

                ],

                summary: "The Mali Empire demonstrated the political, economic and cultural achievements of medieval West Africa."

            }

        ],

        ancient: [

            {
                title: "Ancient Egyptian Civilization",

                intro: "Ancient Egypt developed along the River Nile in northeastern Africa. It became one of the world's most influential ancient civilizations.",

                sections: [

                    {
                        heading: "1. The Nile River",
                        text: "The Nile provided water, fertile land and a transport route. Its annual flooding supported agriculture and helped Egyptian communities develop stable settlements."
                    },

                    {
                        heading: "2. Pharaohs and Government",
                        text: "Egypt was ruled by kings known as pharaohs. They held political and religious authority. Officials and scribes helped administer the kingdom."
                    },

                    {
                        heading: "3. Pyramids and Architecture",
                        text: "The ancient Egyptians built impressive monuments, including the pyramids at Giza. These structures demonstrate their knowledge of engineering, organisation and architecture."
                    },

                    {
                        heading: "4. Knowledge and Culture",
                        text: "Egyptians developed systems of writing, mathematics and medicine. Hieroglyphic writing was used in religious, royal and administrative contexts."
                    }

                ],

                summary: "Ancient Egypt made lasting contributions to architecture, writing, mathematics, government and art."

            }

        ],

        world: [

            {
                title: "The First World War (1914–1918)",

                intro: "The First World War was a major international conflict that transformed Europe and affected societies across the world.",

                sections: [

                    {
                        heading: "1. Causes of the War",
                        text: "The war had several long-term causes, including militarism, alliances, imperial rivalries and nationalism. The assassination of Archduke Franz Ferdinand of Austria-Hungary in June 1914 triggered the July Crisis."
                    },

                    {
                        heading: "2. The Main Alliances",
                        text: "The Central Powers included Germany, Austria-Hungary and the Ottoman Empire. The Allied Powers included Britain, France and Russia, with other countries joining during the war."
                    },

                    {
                        heading: "3. The Global Conflict",
                        text: "The war was fought in Europe, Africa, the Middle East and other regions. Soldiers and civilians from many parts of the world were affected, including people in colonial territories."
                    },

                    {
                        heading: "4. The End of the War",
                        text: "The fighting ended with the armistice of 11 November 1918. The Treaty of Versailles was signed in 1919 and imposed important terms on Germany."
                    }

                ],

                summary: "The First World War reshaped international politics, weakened empires and contributed to major changes in the twentieth century."

            }

        ]

    };

  
    // =========================================
    // LOAD SHARED ARTICLES FROM SUPABASE
    // =========================================

    async function loadSharedArticles() {

        const database = window.historybotSupabase;

        if (!database) {
            console.error("HISTORYBOT: Supabase connection not found.");
            return;
        }

        try {

            const { data, error } = await database
                .from("history_articles")
                .select(
                    "id, title, summary, topic, source_name, source_url, published_at"
                )
                .order("published_at", { ascending: false });

            if (error) {
                throw error;
            }

            if (!Array.isArray(data)) {
                return;
            }

            data.forEach(function (row) {

                const category = String(row.topic || "").toLowerCase();

                // Only accept the four existing library categories
                if (!historyArticles[category]) {
                    return;
                }

                // Avoid adding the same article twice
                const alreadyExists = historyArticles[category].some(
                    function (article) {
                        return (
                            (row.source_url &&
                             article.source_url === row.source_url) ||
                            article.title === row.title
                        );
                    }
                );

                if (alreadyExists) {
                    return;
                }

                historyArticles[category].push({

                    title: row.title || "Untitled History Article",

                    intro: row.summary || "No summary is available.",

                    sections: [],

                    summary: row.summary || "No summary is available.",

                    source_name: row.source_name || "Original source",

                    source_url: row.source_url || "",

                    published_at: row.published_at || null

                });

            });

            console.log(
                "HISTORYBOT: Shared articles loaded:",
                data.length
            );

        } catch (error) {

            console.error(
                "HISTORYBOT: Could not load shared articles:",
                error.message
            );

        }

    }

    // Load shared articles when HISTORYBOT opens
    loadSharedArticles();

    // =========================================
    // 15. LIBRARY DISPLAY
    // =========================================

    function showLibraryCategory(category) {

        const articles = historyArticles[category];

        if (!articles || !libraryArticles) {
            return;
        }

        libraryArticles.innerHTML = "";

        if (articleReader) {
            articleReader.style.display = "none";
        }

        libraryArticles.style.display = "block";

        const heading = document.createElement("h2");

        const categoryNames = {
            kenyan: "🇰🇪 Kenyan History",
            african: "🌍 African History",
            ancient: "🏛️ Ancient Civilizations",
            world: "🌐 World History"
        };

        heading.textContent =
            categoryNames[category] || "History Articles";

        libraryArticles.appendChild(heading);

        articles.forEach(function (article, index) {

            const card = document.createElement("div");

            card.classList.add("library-article-card");

            const title = document.createElement("h3");

            title.textContent = article.title;

            const introduction = document.createElement("p");

            introduction.textContent = article.intro;

            const readButton = document.createElement("button");

            readButton.textContent = "Read Article →";

            readButton.addEventListener("click", function () {

                openArticle(category, index);

            });

            card.appendChild(title);
            card.appendChild(introduction);
            card.appendChild(readButton);

            libraryArticles.appendChild(card);

        });

    }

  // =========================================
// 16. ARTICLE READER
// =========================================

function openArticle(category, index) {

    const article = historyArticles[category]?.[index];

    if (!article || !articleContent || !articleReader) {
        return;
    }

    articleContent.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = article.title;

    const introduction = document.createElement("p");
    introduction.textContent = article.intro;
    introduction.classList.add("article-introduction");

    articleContent.appendChild(title);
    articleContent.appendChild(introduction);

    article.sections.forEach(function (section) {

        const heading = document.createElement("h2");
        heading.textContent = section.heading;

        const paragraph = document.createElement("p");
        paragraph.textContent = section.text;

        articleContent.appendChild(heading);
        articleContent.appendChild(paragraph);

    });

    const summaryHeading = document.createElement("h2");
    summaryHeading.textContent = "Article Summary";

    const summaryText = document.createElement("p");
    summaryText.textContent = article.summary;

    articleContent.appendChild(summaryHeading);
    articleContent.appendChild(summaryText);

    // DISPLAY ORIGINAL SOURCE LINK

    if (article.source_url) {

        try {

            const sourceURL = new URL(article.source_url);

            if (sourceURL.protocol === "https:") {

                const sourceHeading = document.createElement("h2");
                sourceHeading.textContent = "Article Source";

                const sourceLink = document.createElement("a");

                sourceLink.href = sourceURL.href;
                sourceLink.textContent =
                    "Read original article from " +
                    (article.source_name || "the original source");

                sourceLink.target = "_blank";
                sourceLink.rel = "noopener noreferrer";

                articleContent.appendChild(sourceHeading);
                articleContent.appendChild(sourceLink);

            }

        } catch (error) {

            console.warn("HISTORYBOT: Invalid article source link.");

        }

    }

    // Hide other library content
    if (libraryMainContent) {
        libraryMainContent.style.display = "none";
    }

    if (libraryArticles) {
        libraryArticles.style.display = "none";
    }

    if (searchResults) {
        searchResults.style.display = "none";
    }

    // Show article
    articleReader.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
    
    // =========================================
    // 17. LIBRARY CATEGORY BUTTONS
    // =========================================

    const categoryButtons = document.querySelectorAll(
        ".library-category"
    );

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = button.dataset.category;

            showLibraryCategory(category);

        });

    });

    // =========================================
    // 18. HISTORY LIBRARY SEARCH
    // =========================================

    function searchHistoryArticles(query) {

        if (
            !searchResults ||
            !historySearch ||
            !libraryMainContent ||
            !libraryArticles ||
            !articleReader
        ) {
            return;
        }

        const searchTerm = normalizeText(query);

        searchResults.innerHTML = "";

        if (!searchTerm) {

            searchResults.style.display = "none";
            libraryMainContent.style.display = "block";
            libraryArticles.style.display = "block";
            articleReader.style.display = "none";

            return;
        }

        lastSearchQuery = query;

        libraryMainContent.style.display = "none";
        libraryArticles.style.display = "none";
        articleReader.style.display = "none";
        searchResults.style.display = "block";

        const heading = document.createElement("h2");

        heading.textContent = "Search Results";

        searchResults.appendChild(heading);

        const categoryNames = {
            kenyan: "🇰🇪 Kenyan History",
            african: "🌍 African History",
            ancient: "🏛️ Ancient Civilizations",
            world: "🌐 World History"
        };

        let foundArticles = 0;

        Object.keys(historyArticles).forEach(function (category) {

            historyArticles[category].forEach(function (article, index) {

                const searchableContent = [

                    article.title,
                    article.intro,
                    article.summary,

                    ...article.sections.map(function (section) {

                        return section.heading + " " + section.text;

                    })

                ].join(" ");

                if (
                    normalizeText(searchableContent).includes(searchTerm)
                ) {

                    foundArticles++;

                    const card = document.createElement("div");

                    card.classList.add("library-article-card");

                    const title = document.createElement("h3");

                    title.textContent = article.title;

                    const categoryLabel = document.createElement("p");

                    categoryLabel.textContent =
                        categoryNames[category];

                    const introduction = document.createElement("p");

                    introduction.textContent = article.intro;

                    const readButton = document.createElement("button");

                    readButton.textContent = "Read Article →";

                    readButton.addEventListener("click", function () {

                        openArticle(category, index);

                    });

                    card.appendChild(title);
                    card.appendChild(categoryLabel);
                    card.appendChild(introduction);
                    card.appendChild(readButton);

                    searchResults.appendChild(card);

                }

            });

        });

        if (foundArticles === 0) {

            const noResults = document.createElement("p");

            noResults.textContent =
                "No matching articles found. Try another historical topic.";

            searchResults.appendChild(noResults);

        }

    }

    // SEARCH WHILE TYPING

    if (historySearch) {

        historySearch.addEventListener("input", function () {

            searchHistoryArticles(historySearch.value);

        });

    }

    // CLEAR SEARCH

    if (clearHistorySearch) {

        clearHistorySearch.addEventListener("click", function () {

            if (historySearch) {
                historySearch.value = "";
            }

            lastSearchQuery = "";

            if (searchResults) {
                searchResults.innerHTML = "";
                searchResults.style.display = "none";
            }

            if (libraryMainContent) {
                libraryMainContent.style.display = "block";
            }

            if (libraryArticles) {
                libraryArticles.style.display = "block";
            }

            if (articleReader) {
                articleReader.style.display = "none";
            }

            if (historySearch) {
                historySearch.focus();
            }

        });

    }
  
// =========================================
// 19. BACK TO LIBRARY
// =========================================

if (backToLibrary) {

    backToLibrary.addEventListener("click", function () {

        if (articleReader) {
            articleReader.style.display = "none";
        }

        if (lastSearchQuery) {

            if (searchResults) {
                searchResults.style.display = "block";
            }

            if (libraryMainContent) {
                libraryMainContent.style.display = "none";
            }

        } else {

            if (searchResults) {
                searchResults.style.display = "none";
            }

            if (libraryMainContent) {
                libraryMainContent.style.display = "block";
            }

            if (libraryArticles) {
                libraryArticles.style.display = "block";
            }

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}
    
    // =========================================
    // 20. MENU ACTIVATION
    // =========================================

    if (menuToggle && menuOptions) {

        menuToggle.addEventListener("click", function (event) {

            event.stopPropagation();

            menuOptions.classList.toggle("show");

        });

    }

    // CLOSE MENU WHEN CLICKING OUTSIDE

    document.addEventListener("click", function (event) {

        if (
            menuOptions &&
            menuToggle &&
            !menuOptions.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            closeMenu();

        }

    });

    // MENU ITEM ACTIVATION

    function activateMenuItem(id, action) {

        const item = get(id);

        if (!item) return;

        item.addEventListener("click", function () {

            closeMenu();

            action();

        });

    }

    // MY CHATS

    activateMenuItem("my-chats-menu", function () {

        showPage(chatPage);

        if (savedChats) {
            savedChats.open = true;
        }

    });

    // FAVORITES

    activateMenuItem("favorites-menu", function () {

        renderFavorites();

        showPage(favoritesPage);

    });

    // HISTORY QUIZ

    activateMenuItem("history-quiz-menu", function () {

        showPage(quizPage);

    });

    // HISTORY LIBRARY

    activateMenuItem("history-library-menu", function () {

        showPage(libraryPage);

        if (searchResults) {
            searchResults.style.display = "none";
        }

        if (libraryMainContent) {
            libraryMainContent.style.display = "block";
        }

        if (libraryArticles) {
            libraryArticles.style.display = "block";
        }

        if (articleReader) {
            articleReader.style.display = "none";
        }

        if (historySearch) {
            historySearch.value = "";
        }

        lastSearchQuery = "";

    });

    // SETTINGS

    activateMenuItem("settings-menu", function () {

        showPage(settingsPage);

    });

  // OPEN THEMES

if (openThemes) {

    openThemes.addEventListener("click", function () {

        showPage(themesPage);

    });

}

// ABOUT HISTORYBOT
activateMenuItem("open-about", function () {
    showPage(aboutPage);
});

  // OPEN DATA & STORAGE
activateMenuItem("open-storage", function () {

    showPage(dataStoragePage);

});

activateMenuItem("open-notifications", function () {
    showPage(notificationsPage);
});
  
  // =========================================
// DATA & STORAGE REFRESH
// =========================================

const refreshStorageBtn = get("refresh-storage-data");
const popup = get("popup");

if (refreshStorageBtn && popup) {
    refreshStorageBtn.addEventListener("click", async function () {

        refreshStorageBtn.disabled = true;
        refreshStorageBtn.textContent = "Refreshing...";

        try {
            // Get article count from Supabase
            const database = window.historybotSupabase;

            if (!database) {
                throw new Error("Supabase connection is unavailable.");
            }

            const { count, error } = await database
                .from("history_articles")
                .select("*", { count: "exact", head: true });

            if (error) throw error;

            // Update article count
            const articleCount = get("storage-article-count");
            if (articleCount) {
                articleCount.textContent = count ?? 0;
            }

            // Update conversation count
            const conversationCount = get("storage-conversation-count");
            if (conversationCount) {
                conversationCount.textContent = conversations.length;
            }

            // Calculate local storage usage
            let totalBytes = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key) || "";

                totalBytes += (key.length + value.length) * 2;
            }

            const usage = get("storage-local-usage");

            if (usage) {
                usage.textContent = totalBytes < 1024 * 1024
                    ? (totalBytes / 1024).toFixed(2) + " KB"
                    : (totalBytes / (1024 * 1024)).toFixed(2) + " MB";
            }

            // Backblaze archive is not yet verified
            const archiveCount = get("storage-archive-count");

            if (archiveCount) {
                archiveCount.textContent = "Not connected";
            }

            popup.textContent = "Storage information refreshed successfully!";
            popup.classList.add("show");

        } catch (error) {
            console.error("Storage refresh error:", error);

            popup.textContent = "Could not refresh storage information.";
            popup.classList.add("show");

        } finally {
            refreshStorageBtn.disabled = false;
            refreshStorageBtn.textContent = "Refresh Storage Data";

            setTimeout(function () {
                popup.classList.remove("show");
            }, 3000);
        }
    });
}


// =========================================
// NOTIFICATION PREFERENCES
// =========================================

const notificationToggles = [
    "daily-facts-toggle",
    "new-articles-toggle",
    "quiz-reminders-toggle"
];

notificationToggles.forEach(function (id) {
    const toggle = get(id);

    if (!toggle) return;

    // Restore previously saved preference
    toggle.checked = localStorage.getItem("historybot-" + id) === "true";

    // Save whenever the user changes a preference
    toggle.addEventListener("change", function () {
        localStorage.setItem(
            "historybot-" + id,
            toggle.checked
        );
    });
});

  
// =========================================
// BROWSER NOTIFICATIONS
// =========================================

const enableNotificationsBtn = get("enable-browser-notifications");
const notificationStatus = get("notification-status");

if (enableNotificationsBtn && notificationStatus) {

    // Check current permission
    if (!("Notification" in window)) {
        notificationStatus.textContent =
            "This browser does not support notifications.";
        enableNotificationsBtn.disabled = true;

    } else if (Notification.permission === "granted") {
        notificationStatus.textContent =
            "Browser notifications are enabled.";

    } else if (Notification.permission === "denied") {
        notificationStatus.textContent =
            "Notifications are blocked in browser settings.";
    }

    enableNotificationsBtn.addEventListener("click", async function () {

        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            notificationStatus.textContent =
                "Browser notifications are already enabled.";
            return;
        }

        try {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                notificationStatus.textContent =
                    "Success! Browser notifications are enabled.";
            } else {
                notificationStatus.textContent =
                    "Notification permission was not granted.";
            }

        } catch (error) {
            console.error("Notification permission error:", error);
            notificationStatus.textContent =
                "Could not request notification permission.";
        }
    });
}

  
    // =========================================
    // 21. THEME ENGINE
    // =========================================
  
    const savedTheme =
        localStorage.getItem("historybot-theme") || "midnight";

    function applyTheme(theme) {

        if (theme === "midnight") {

            document.body.removeAttribute("data-theme");

        } else {

            document.body.setAttribute("data-theme", theme);

        }

        themeCards.forEach(function (card) {

            card.classList.remove("selected");

            if (card.dataset.theme === theme) {
                card.classList.add("selected");
            }

        });

        try {

            localStorage.setItem("historybot-theme", theme);

        } catch (error) {

            console.error("Could not save theme:", error);

        }

    }

    // APPLY SAVED THEME

    applyTheme(savedTheme);

    // THEME SELECTION

    themeCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const selectedTheme = card.dataset.theme;

            if (selectedTheme) {
                applyTheme(selectedTheme);
            }

        });

    });

    // =========================================
    // 22. INITIALIZATION COMPLETE
    // =========================================

    console.log("HISTORYBOT initialized successfully!");

});
