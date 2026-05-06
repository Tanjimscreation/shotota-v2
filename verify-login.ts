import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';

(async () => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
      select: { email: true, password: true, name: true, id: true }
    });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('👤 User Found:', user.name);
    console.log('📧 Email:', user.email);
    
    // Test password comparison
    const testPassword = 'password';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Password matches! Login will work.');
    } else {
      console.log('❌ Password does not match');
    }
    
    process.exit(0);
  } catch(e: any) {
    console.log('❌ Error:', e.message);
    process.exit(1);
  }
})();
