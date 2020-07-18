import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../../models/User';
import { JWT_SECRET } from '../../util/environment';
import { UserJWT } from '../../types/jwt';

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

function refreshJwt(current: UserJWT): string {
  return jwt.sign(
    {
      email: current.email,
      id: current.id,
      name: current.name,
      picture: current.picture
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

function buildUserForLog(req: UserForLogRequest): UserForLog {
  if (req.userDocument) {
    return {
      id: req.userDocument._id,
      email: req.userDocument.email,
      profile: req.userDocument.profile
    };
  } else if (req.jwt) {
    return {
      id: req.jwt.id,
      email: req.jwt.email,
      profile: {
        name: req.jwt.name
      }
    };
  }
}

export const UserServiceHelper = {
  createJwt,
  refreshJwt,
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

interface UserForLogRequest {
  userDocument?: UserDocument;
  jwt?: UserJWT;
}
