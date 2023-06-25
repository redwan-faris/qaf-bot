import { Connection } from 'mysql2/promise';

async function seedMessages(connection: Connection) {
    try {
        const messagesToSeed = [
            {

                "messageKey": "BLOGGER",
                "messageContent": "مدون"
            },
            {

                "messageKey": "REPORTER",
                "messageContent": "مراسل"
            },
            {

                "messageKey": "SENDER_TYPE_QUESTION",
                "messageContent": "كيف تريد "
            },
            {

                "messageKey": "CREETING",
                "messageContent": "هاي"
            },
            {

                "messageKey": "REPORTER_NAME_QUESTION",
                "messageContent": "اكتب اسم المراسل"
            },
            {

                "messageKey": "LOCATION_NAME_QUESTION",
                "messageContent": "اكتب اسم الموقع"
            },
            {

                "messageKey": "MEDIA_QUESTION",
                "messageContent": "ادخل الصوره"
            },
            {

                "messageKey": "GRATITUDE_MESSAGEX",
                "messageContent": "شكرا لاستخدامك البوت"
            },
            {

                "messageKey": "EVENT_NAME_QUESTION",
                "messageContent": "ادخل الحدث"
            },
            {

                "messageKey": "MEDIA_ACCEPT",
                "messageContent": "لا"
            },
            {

                "messageKey": "MEDIA_DECLINE",
                "messageContent": "نعم"
            },
            {

                "messageKey": "SECOND_MEDIA_QUESTION",
                "messageContent": "اكو بعد صور؟"
            }
        ]

        for (const message of messagesToSeed) {
            await connection.query('INSERT INTO messages (id, message_key, message_content) VALUES (?, ?, ?)', [

                message.messageKey,
                message.messageContent,
            ]);
        }
        console.log(`Successfully seeded ${messagesToSeed.length} Messages.`);
    } catch (error) {
        console.error('Error seeding messages:', error);
    }
}

export default seedMessages;