import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { connectDatabase, getDocument } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                const client = await connectDatabase();
                const db = client.db();
                const user = await getDocument(db, 'users', {
                    email: credentials.email,
                });
                client.close();
                if (!user) {
                    throw new Error('No User found');
                }
                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );
                if (!isValid) {
                    throw new Error('Login failed !!!');
                }
                return {
                    email: user.email,
                };
            },
        }),
    ],
});
