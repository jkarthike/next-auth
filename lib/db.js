import { MongoClient } from 'mongodb';

export async function connectDatabase() {
    return await MongoClient.connect(
        'mongodb+srv://dbUser:Passw0rd!@cluster0.ldp5l.mongodb.net/auth-demo?retryWrites=true&w=majority',
        { useUnifiedTopology: true }
    );
}

export async function insertDocument(db, collection, document) {
    return await db.collection(collection).insertOne(document);
}

export async function getAllDocuments(db, collection, sort) {
    return await db.collection(collection).find().sort(sort).toArray();
}

export async function getDocument(db, collection, document) {
    return await db.collection(collection).findOne(document);
}

export async function updateDocument(db, collection, whereCondition, setValue) {
    return await db.collection(collection).updateOne(whereCondition, setValue);
}
