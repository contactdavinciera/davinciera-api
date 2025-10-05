export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password?: string; // Password should be hashed in a real app
  readonly role: string; // 'student', 'instructor', 'affiliate'
  readonly avatarUrl?: string;
  readonly bio?: string;
  readonly affiliateCode?: string;
  readonly payoutDetails?: any; // Simplified for mock, would be more detailed
}
