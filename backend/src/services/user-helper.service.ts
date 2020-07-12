import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../models/User';
import { JWT_SECRET } from '../util/environment';

function createJwt(user: UserDocument): string {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      name: user.profile.name,
      picture: user.profile.picture
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

async function isValidEmail(email: string): Promise<boolean> {
  const emailCheckRegex = /^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return email && !(await User.exists({ email })) && emailCheckRegex.test(email);
}

function isValidPassword(password: string): boolean {
  const passwordCheckRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return password && passwordCheckRegex.test(password);
}

function buildUserForLog(user: UserDocument): UserForLog {
  return {
    id: user._id,
    email: user.email,
    profile: user.profile
  };
}

export const UserServiceHelper = {
  createJwt,
  isValidEmail,
  isValidPassword,
  buildUserForLog
};

interface UserForLog {
  id: string;
  email: string;
  profile: {
    name: string;
    picture?: string;
  }
}
