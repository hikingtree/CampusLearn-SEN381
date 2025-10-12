class ChatbotInteraction {
    constructor(id, queryText, responseText, confidence, escalated, timestamp) {

        this.id = id;
        this.queryText = queryText;
        this.responseText = responseText;
        this.confidence = confidence;
        this.escalated = escalated;
        this.timestamp = timestamp;
    }

    recordLog(entry) {

    }

    escalateToTutor() {

    }
}