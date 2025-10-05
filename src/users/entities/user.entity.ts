export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string; // 'student', 'instructor', 'affiliate'
  avatarUrl?: string;
  bio?: string;
  affiliateCode?: string;
  payoutDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}
