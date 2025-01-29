import { databases } from "./config";
import { ID } from "appwrite";

const db = {};

const collections = [
    {
        dbId: import.meta.env.VITE_DATABASE_ID,
        id: '672f8386001eb724f220',
        name: "userdetails",
    },
    {
        dbId: import.meta.env.VITE_DATABASE_ID,
        id: import.meta.env.VITE_COLLECTION_ID_TODOS,
        name: "todocollection",
    }
];

collections.forEach((col) => {
    db[col.name] = {
        create: (payload, permissions, id = ID.unique()) =>
            databases.createDocument(
                col.dbId,
                col.id,
                id,
                payload,
                 
            ),
        update: (id, payload, permissions) =>
            databases.updateDocument(
                col.dbId,
                col.id,
                id,
                payload,
                
            ),
            updatePassword: (userId, currentPassword, newPassword) =>
                databases.updateDocument(
                    col.dbId,
                    col.id,
                    userId,
                    { password: newPassword },
                    ['users'] // Using the new permission syntax
                ),
            delete: (id) => databases.deleteDocument(col.dbId, col.id, id),
            list: (queries = []) =>
                databases.listDocuments(col.dbId, col.id, queries),
            get: (id) => databases.getDocument(col.dbId, col.id, id),
        };
});

export default db;