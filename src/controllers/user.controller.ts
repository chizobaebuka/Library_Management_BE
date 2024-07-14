import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { generateToken } from "../utils/helpers";
import { ILoginRequest, ISignupRequest, IUpdateProfileRequest, IUser } from "../interface/user.interface";
import { signUpUserSchema, updateUserProfileSchema } from "../validations/user.validation";

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export const signupUser = async (req: Request<{}, {}, ISignupRequest>, res: Response) => {
    try {
        const validation = signUpUserSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { firstName, lastName, dateOfBirth, country, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
            firstName,
            lastName,
            dateOfBirth,
            country,
            email,
            password: hashedPassword
        };

        const newUser = await User.create(user);
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(400).json({ error: error });
    }
};

export const loginUser = async (req: Request<{}, {}, ILoginRequest>, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const userObj = user.toJSON();
        delete userObj.password;
        delete userObj.id;

        const token = generateToken({ id: user.id, email: user.email });

        res.cookie('token', token, { httpOnly: true });
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).json({
            user: userObj,
            token,
        });
    } catch (error: any) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.userId;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userObj = user.toJSON();
        delete userObj.password;  // Exclude password from the user object
        delete userObj.id;  // Exclude id from the user object

        res.status(200).json(userObj);
    } catch (error: any) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        // console.log({users})
        res.status(200).json(users);
    } catch (error: any) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateUserProfile = async (req: Request<{ userId: string }, {}, IUpdateProfileRequest>, res: Response) => {
    // Extract user ID from route parameters
    const id = parseInt(req.params.userId, 10);

    // Validate and transform request body using Zod schema
    const validation = updateUserProfileSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    // Extract validated data
    const { firstName, lastName, email, dateOfBirth, country } = validation.data;

    try {
        // Find user by primary key
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }

        // Update user profile with provided fields or retain existing values
        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;
        user.email = email ?? user.email;
        user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
        user.country = country ?? user.country;

        // Exclude password field
        const { password, ...userWithoutPassword } = user.toJSON();

        // Save changes to the database
        await user.save();

        // Respond with success message and updated user data
        res.status(200).json({
            message: 'User updated successfully',
            data: userWithoutPassword,
            status: 200
        });
    } catch (error: any) {
        // Log and handle errors
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.userId, 10);  // Ensure id is an integer

    try {
        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }

        await user.destroy();  // Delete user

        res.status(200).json({
            message: 'User deleted successfully',
            status: 200
        });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}