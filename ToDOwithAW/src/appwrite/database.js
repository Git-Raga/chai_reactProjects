import { databases } from "./config";
import { ID, Query } from "appwrite";

const db = {
    userdetails: {
        create: (payload, id = ID.unique()) =>
            databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                '672f8386001eb724f220',
                id,
                payload
            ),
        update: (id, payload) =>
            databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                '672f8386001eb724f220',
                id,
                payload
            ),
        updatePassword: (userId, currentPassword, newPassword) =>
            databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                '672f8386001eb724f220',
                userId,
                { password: newPassword },
                ['users']
            ),
        delete: (id) => databases.deleteDocument(import.meta.env.VITE_DATABASE_ID, '672f8386001eb724f220', id),
        list: (queries = []) =>
            databases.listDocuments(import.meta.env.VITE_DATABASE_ID, '672f8386001eb724f220', queries),
        get: (id) => databases.getDocument(import.meta.env.VITE_DATABASE_ID, '672f8386001eb724f220', id),
        getUserStats: async (userEmail) => {
            // Existing getUserStats implementation
        }
    },
    todocollection: {
        create: (payload, id = ID.unique()) =>
            databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_COLLECTION_ID_TODOS,
                id,
                payload
            ),
        update: (id, payload) =>
            databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_COLLECTION_ID_TODOS,
                id,
                payload
            ),
        delete: (id) => databases.deleteDocument(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_COLLECTION_ID_TODOS, id),
        list: (queries = []) =>
            databases.listDocuments(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_COLLECTION_ID_TODOS, queries),
        get: (id) => databases.getDocument(import.meta.env.VITE_DATABASE_ID, import.meta.env.VITE_COLLECTION_ID_TODOS, id)
    },
    supporttickets: {
        getTickets: async () => {
            try {
                const response = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID_TICKETS,
                    [Query.orderDesc('$createdAt')]
                );
                return response.documents;
            } catch (error) {
                console.error('Error fetching tickets:', error);
                throw error;
            }
        },
        createTicket: async (payload) => {
            try {
                // First, get the current count of tickets
                const existingTickets = await databases.listDocuments(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID_TICKETS
                );
        
                // Generate ticket number based on current count
                const ticketCount = existingTickets.total;
                const ticketNumber = `TF_TKT_${String(ticketCount + 1).padStart(3, '0')}`;
        
                // Create ticket with generated ticket number
                await databases.createDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID_TICKETS,
                    ID.unique(),
                    {
                        ticketnumber: ticketNumber,
                        issueDescription: payload.issueDescription,
                        stepsToReproduce: payload.stepsToReproduce,
                        urgency: payload.urgency,
                        reportedby: payload.reportedby,
                        status: 'Open',
                        developercomments: ''
                    }
                );
            } catch (error) {
                console.error('Error creating ticket:', error);
                throw error;
            }
        },
        updateTicket: async (id, payload) => {
            try {
                await databases.updateDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID_TICKETS,
                    id,
                    payload
                );
            } catch (error) {
                console.error('Error updating ticket:', error);
                throw error;
            }
        },
        deleteTicket: async (id) => {
            try {
                await databases.deleteDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_COLLECTION_ID_TICKETS,
                    id
                );
            } catch (error) {
                console.error('Error deleting ticket:', error);
                throw error;
            }
        }
    }
};

export default db;