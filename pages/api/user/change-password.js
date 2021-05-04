import { getSession } from 'next-auth/client';
import { connectDatabase, updateDocument, getDocument } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';
import { hashPassword } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req });
    if (!session) {
        return res.status('401').json({ message: 'Unauthorised' });
    }

    const bodyObj = JSON.parse(req.body);
    const userEmail = session.user.email;
    const oldPassword = bodyObj.oldPassword;
    const newPassword = bodyObj.newPassword;

    const hashedNewPassword = await hashPassword(newPassword);
    const client = await connectDatabase();
    const db = client.db();
    const userDocument = await getDocument(db, 'users', { email: userEmail });
    if (!userDocument) {
        client.close();
        return res.status(404).json({ message: 'User not found' });
    }
    const currentPassword = userDocument.password;

    const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordAreEqual) {
        client.close();
        return res.status(422).json({ message: 'old Passwords doesnot match' });
    }

    const updatePromise = await updateDocument(
        db,
        'users',
        { email: userEmail },
        { $set: { password: hashedNewPassword } }
    );
    console.log(updatePromise);
    if (updatePromise) {
        client.close();
        return res.status(201).json({ message: 'Update password successful' });
    }

    client.close();
    return res.status(500).json({ message: 'Update failed !!!' });
}

export default handler;
