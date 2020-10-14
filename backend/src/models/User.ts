import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  profile: {
    name: string;
    pictureId: string;
  };

  comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string) => boolean;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  profile: {
    name: String,
    pictureId: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function hashPassword(next: any) {
  const user = this as UserDocument;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      return next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>('User', userSchema);
