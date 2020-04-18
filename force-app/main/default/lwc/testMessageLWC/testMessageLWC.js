import {LightningElement, track} from 'lwc';
import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    createMessageContext,
    releaseMessageContext
} from 'lightning/messageService';
import SAYWHATMC from "@salesforce/messageChannel/SayWhat__c";

export default class TestMessageLwc extends LightningElement {
    @track
    myMessage = '';
    @track
    receivedMessage = '';
    channel;
    context = createMessageContext();

    constructor() {
        super();
    }

    handleSendMessage() {
        this.publish();
    }

    handleSubscribe() {
        const parentPage = this;
        this.channel = subscribe(this.context, SAYWHATMC, (event) => {
            if (event != null) {
                const message = event.messageToSend;
                const source = event.sourceSystem;
                parentPage.receivedMessage = 'Message: ' + message + '. Sent From: ' + source;
            }
        }, {scope: APPLICATION_SCOPE});
    }

    handleUnsubscribe() {
        unsubscribe(this.channel);
    }

    handleChange(event) {
        this.myMessage = event.target.value;
    }

    publish() {
        const payload = {
            sourceSystem: "lwc",
            messageToSend: this.myMessage
        };
        publish(this.context, SAYWHATMC, payload);
    }

    disconnectedCallback() {
        releaseMessageContext(this.context);
    }
}