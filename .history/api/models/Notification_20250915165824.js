class Notification {
    constructor(id, recipient, channel, templateKey, status, createdAt,sentAt){
        this.id = id;
        this.recipient = recipient;
        this.channel = channel;
        this.templateKey = templateKey;
        this.status = status;
        this.createdAt = createdAt;
        this.sentAt = sentAt;
    }

    dispatch(){

    }

    retry(){

    }
}