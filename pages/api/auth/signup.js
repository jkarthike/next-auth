import { connectDatabase, insertDocument } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return;
    }

    const data = JSON.parse(req.body);
    const { email, password } = data;

    if (!email || !password) {
        res.status(422).json({ message: 'Invalid input' });
    }

    const client = await connectDatabase();
    const hashedPassword = await hashPassword(password);
    const result = await insertDocument(client, 'users', {
        email: email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: 'User Created successfully',
        data: result,
    });
}

export default handler;
